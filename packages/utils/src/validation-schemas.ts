import { z } from 'zod'

export const emailSchema = z.string().email('Email invalide')

export const passwordSchema = z
  .string()
  .min(8, 'Minimum 8 caracteres')
  .regex(/[A-Z]/, 'Au moins une majuscule')
  .regex(/[a-z]/, 'Au moins une minuscule')
  .regex(/[0-9]/, 'Au moins un chiffre')

export const uuidSchema = z.string().uuid('UUID invalide')

export const slugSchema = z
  .string()
  .min(3, 'Minimum 3 caracteres')
  .max(50, 'Maximum 50 caracteres')
  .regex(/^[a-z0-9-]+$/, 'Uniquement lettres minuscules, chiffres et tirets')

export const phoneSchema = z
  .string()
  .regex(/^\+?[0-9\s-]{10,20}$/, 'Numero de telephone invalide')
