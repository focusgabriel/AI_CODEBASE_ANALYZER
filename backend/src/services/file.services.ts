import { CreateFileDto } from "../dtos/file.dto.js";
import { createFiles } from "../repositories/file.repository.js";

export async function saveFiles(files: CreateFileDto[]) {
  return createFiles(files);
}
