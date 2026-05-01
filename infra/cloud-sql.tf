# Instância Cloud SQL (PostgreSQL 15)
resource "google_sql_database_instance" "pi3" {
  name             = "pi3-postgres"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier              = "db-f1-micro"   # menor tier — adequado para microempresas
    availability_type = "ZONAL"
    disk_size         = 10
    disk_autoresize   = true

    backup_configuration {
      enabled            = true
      start_time         = "03:00"
      binary_log_enabled = false
    }

    ip_configuration {
      ipv4_enabled    = false           # sem IP público — acessa via Cloud SQL Proxy
      private_network = "projects/${var.project_id}/global/networks/default"
    }
  }

  deletion_protection = true

  depends_on = [google_project_service.apis]
}

resource "google_sql_database" "pi3db" {
  name     = "pi3db"
  instance = google_sql_database_instance.pi3.name
}

resource "google_sql_user" "pi3user" {
  name     = "pi3user"
  instance = google_sql_database_instance.pi3.name
  password = var.db_password
}

# Secret para a DATABASE_URL
resource "google_secret_manager_secret" "db_url" {
  secret_id = "pi3-database-url"

  replication {
    auto {}
  }

  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret_version" "db_url" {
  secret = google_secret_manager_secret.db_url.id
  secret_data = "postgresql://pi3user:${var.db_password}@/${google_sql_database.pi3db.name}?host=/cloudsql/${google_sql_database_instance.pi3.connection_name}"
}
