-- A correct answer with an accent or ¿ ? note still joins the mistakes (#659, ADR 0011).
ALTER TABLE attempts
  ADD COLUMN noted boolean NOT NULL DEFAULT false;
