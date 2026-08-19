import { ZodError } from "zod";
import { AppError } from "./errors.js";

export function validate(schema, source = "body") {
  return (req, res, next) => {
    try {
      req[source] = schema.parse(req[source]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new AppError(error.issues.map(i => i.message).join(", "), 400));
      }
      next(error);
    }
  };
}