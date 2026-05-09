export interface ValidationProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  errors: Record<string, string[]>;
}
