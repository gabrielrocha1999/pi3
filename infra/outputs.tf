output "backend_url" {
  description = "URL do backend no Cloud Run"
  value       = google_cloud_run_v2_service.backend.uri
}

output "frontend_url" {
  description = "URL do frontend no Cloud Run"
  value       = google_cloud_run_v2_service.frontend.uri
}

output "cloud_sql_connection_name" {
  description = "Connection name do Cloud SQL"
  value       = google_sql_database_instance.pi3.connection_name
}

output "artifact_registry_repo" {
  description = "Repositório Artifact Registry"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/pi3"
}
