variable "project_id" {
  description = "ID do projeto no GCP"
  type        = string
}

variable "region" {
  description = "Região GCP para os recursos"
  type        = string
  default     = "us-central1"
}

variable "db_password" {
  description = "Senha do usuário PostgreSQL"
  type        = string
  sensitive   = true
}

variable "backend_image" {
  description = "Imagem Docker do backend (Artifact Registry)"
  type        = string
}

variable "frontend_image" {
  description = "Imagem Docker do frontend (Artifact Registry)"
  type        = string
}
