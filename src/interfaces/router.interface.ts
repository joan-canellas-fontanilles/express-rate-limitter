import express from 'express'

export interface Router {
  createRouter: () => express.Router
}
