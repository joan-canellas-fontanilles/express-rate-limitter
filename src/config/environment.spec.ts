import { Environment } from './environment'

describe('Environment', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    const dotenv = require('dotenv')
    jest.spyOn(dotenv, 'config').mockReturnValue(undefined)
    jest.resetModules()
  })

  describe('get default values', () => {
    let environment: Environment

    beforeEach(() => {
      process.env = {
        JWT: 'jsonwebtoken',
        JWT_SECRET: 'jsonwebtokenSecret',
      }
      environment = new Environment()
    })

    it('should port be 4040', () => {
      expect(environment.port).toBe(4040)
    })

    it('should url be http://localhost:4040', () => {
      expect(environment.url).toBe('http://localhost:4040')
    })

    it('should apiPrefix be api', () => {
      expect(environment.apiPrefix).toBe('api')
    })

    it('should isCorsEnabled be true', () => {
      expect(environment.isCORSEnabled).toBe(true)
    })

    it('should redisHttpPort be 6379', () => {
      expect(environment.redisHttpPort).toBe(6379)
    })

    it('should redisHttpHost be 127.0.0.1', () => {
      expect(environment.redisHttpHost).toBe('127.0.0.1')
    })

    it('should logDir be dir/logs/log.log', () => {
      const dir = environment.logDir.split('\\')
      expect(dir[dir.length - 1]).toBe('log.log')
      expect(dir[dir.length - 2]).toBe('logs')
    })

    it('should logLevel be info', () => {
      expect(environment.logLevel).toBe('info')
    })

    it('should jwtSecret be jwt-secret', () => {
      expect(environment.jwtSecret).toBe('jsonwebtokenSecret')
    })

    it('should jwt be jsonwebtoken', () => {
      expect(environment.jwt).toBe('jsonwebtoken')
    })

    it('should ipRateLimit be 100', () => {
      expect(environment.ipRateLimit).toBe(100)
    })

    it('should tokenRateLimit be 200', () => {
      expect(environment.tokenRateLimit).toBe(200)
    })
  })

  describe('get from environment', () => {
    let environment: Environment

    beforeEach(() => {
      process.env = {
        PORT: '8000',
        URL: 'example.com',
        API_PREFIX: 'api-prefix',
        IS_CORS_ENABLED: 'false',
        REDIS_HTTP_PORT: '9736',
        REDIS_HTTP_HOST: 'redis-host',
        LOG_DIR: 'logs_dir',
        LOG_LEVEL: 'log-level',
        JWT_SECRET: 'jwt-secret',
        JWT: 'jsonwebtoken',
        IP_RATE_LIMIT: '123',
        TOKEN_RATE_LIMIT: '234',
      }
      environment = new Environment()
    })

    it('should port be 8000', () => {
      expect(environment.port).toBe(8000)
    })

    it('should url be http://example.com:8000', () => {
      expect(environment.url).toBe('http://example.com:8000')
    })

    it('should apiPrefix be api-prefix', () => {
      expect(environment.apiPrefix).toBe('api-prefix')
    })

    it('should isCorsEnabled be false', () => {
      expect(environment.isCORSEnabled).toBe(false)
    })

    it('should redisHttpPort be 9736', () => {
      expect(environment.redisHttpPort).toBe(9736)
    })

    it('should redisHttpHost be redis-host', () => {
      expect(environment.redisHttpHost).toBe('redis-host')
    })

    it('should logDir be dir/logs_dir/log.log', () => {
      const dir = environment.logDir.split('\\')
      expect(dir[dir.length - 1]).toBe('log.log')
      expect(dir[dir.length - 2]).toBe('logs_dir')
    })

    it('should logLevel be log-level', () => {
      expect(environment.logLevel).toBe('log-level')
    })

    it('should jwtSecret be jwt-secret', () => {
      expect(environment.jwtSecret).toBe('jwt-secret')
    })

    it('should jwt be jsonwebtoken', () => {
      expect(environment.jwt).toBe('jsonwebtoken')
    })

    it('should ipRateLimit be 123', () => {
      expect(environment.ipRateLimit).toBe(123)
    })

    it('should tokenRateLimit be 234', () => {
      expect(environment.tokenRateLimit).toBe(234)
    })
  })

  afterAll(() => {
    process.env = OLD_ENV
  })
})
