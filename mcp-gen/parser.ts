import SwaggerParser from "@apidevtools/swagger-parser";

export async function parseSwagger(filePath: string) {
  const api = await SwaggerParser.dereference(filePath);
  return api;
} 