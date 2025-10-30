// hooks/useFormState.js
import { useState, useCallback } from "react";

// Simple form state helper: fields, setField, reset, validate using Zod
export default function useFormState(initial = {}, validator) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  const setField = useCallback((name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
  }, []);

  const reset = useCallback(
    (next = initial) => {
      setValues(next);
      setErrors({});
    },
    [initial]
  );

  const validate = useCallback(() => {
    if (!validator) return { ok: true };
    try {
      const parsed = validator.parse(values);
      setErrors({});
      return { ok: true, data: parsed };
    } catch (e) {
      const zodErr = e; // zod error
      const errObj = {};
      if (zodErr && zodErr.errors) {
        for (const err of zodErr.errors) {
          const key = err.path[0] || "_";
          errObj[key] = err.message;
        }
      }
      setErrors(errObj);
      return { ok: false, errors: errObj };
    }
  }, [values, validator]);

  return { values, setField, reset, validate, errors };
}
