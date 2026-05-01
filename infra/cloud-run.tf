# Service Account para o Cloud Run
resource "google_service_account" "cloudrun_sa" {
  account_id   = "pi3-cloudrun-sa"
  display_name = "Pi3 Cloud Run Service Account"
}

resource "google_project_iam_member" "cloudrun_sql" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.cloudrun_sa.email}"
}

resource "google_project_iam_member" "cloudrun_secret" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.cloudrun_sa.email}"
}

# Backend — Cloud Run
resource "google_cloud_run_v2_service" "backend" {
  name     = "pi3-backend"
  location = var.region

  template {
    service_account = google_service_account.cloudrun_sa.email

    scaling {
      min_instance_count = 0
      max_instance_count = 3
    }

    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [google_sql_database_instance.pi3.connection_name]
      }
    }

    containers {
      image = var.backend_image

      ports {
        container_port = 8080
      }

      env {
        name = "DATABASE_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.db_url.secret_id
            version = "latest"
          }
        }
      }

      env {
        name  = "ENVIRONMENT"
        value = "production"
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }

      volume_mounts {
        name       = "cloudsql"
        mount_path = "/cloudsql"
      }
    }
  }

  depends_on = [
    google_project_service.apis,
    google_sql_database_instance.pi3,
  ]
}

# Permitir acesso público ao backend
resource "google_cloud_run_v2_service_iam_member" "backend_public" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Frontend — Cloud Run
resource "google_cloud_run_v2_service" "frontend" {
  name     = "pi3-frontend"
  location = var.region

  template {
    scaling {
      min_instance_count = 0
      max_instance_count = 2
    }

    containers {
      image = var.frontend_image

      ports {
        container_port = 80
      }

      env {
        name  = "VITE_API_URL"
        value = google_cloud_run_v2_service.backend.uri
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "256Mi"
        }
      }
    }
  }

  depends_on = [google_cloud_run_v2_service.backend]
}

resource "google_cloud_run_v2_service_iam_member" "frontend_public" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
