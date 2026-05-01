# Repositório de imagens Docker
resource "google_artifact_registry_repository" "pi3" {
  repository_id = "pi3"
  format        = "DOCKER"
  location      = var.region
  description   = "Imagens Docker do projeto Pi3"

  depends_on = [google_project_service.apis]
}
