import { OpenAPIV3 } from 'openapi-types';

export const swaggerConfig: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Gym Management API',
    version: '1.0.0',
    description: 'A comprehensive gym management system API with authentication, member management, attendance tracking, payments, and more.',
    contact: {
      name: 'Gym Management Team',
      email: 'admin@gym.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          role: { type: 'string', enum: ['ADMIN', 'TRAINER', 'RECEPTION', 'MEMBER'] },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Member: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          fullName: { type: 'string' },
          phone: { type: 'string' },
          gender: { type: 'string' },
          dob: { type: 'string', format: 'date-time' },
          photoUrl: { type: 'string' },
          emergencyContact: { type: 'string' },
          notes: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Plan: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          price: { type: 'number' },
          durationDays: { type: 'integer' },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Membership: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          memberId: { type: 'string' },
          planId: { type: 'string' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          status: { type: 'string', enum: ['ACTIVE', 'PAUSED', 'EXPIRED'] },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Attendance: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          memberId: { type: 'string' },
          source: { type: 'string', enum: ['MANUAL', 'QR_CODE', 'FINGERPRINT'] },
          checkIn: { type: 'string', format: 'date-time' },
          checkOut: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Payment: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          memberId: { type: 'string' },
          membershipId: { type: 'string' },
          amount: { type: 'number' },
          method: { type: 'string', enum: ['CASH', 'CARD', 'BANK_TRANSFER', 'MOBILE_MONEY'] },
          reference: { type: 'string' },
          notes: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Expense: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          category: { type: 'string', enum: ['ELECTRICITY', 'WATER', 'RENT', 'EQUIPMENT', 'MAINTENANCE', 'SUPPLIES', 'OTHER'] },
          amount: { type: 'number' },
          note: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Asset: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          category: { type: 'string' },
          serialNo: { type: 'string' },
          purchaseDate: { type: 'string', format: 'date-time' },
          cost: { type: 'number' },
          condition: { type: 'string', enum: ['good', 'repair', 'bad'] },
          location: { type: 'string' },
          notes: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      StatsOverview: {
        type: 'object',
        properties: {
          summary: {
            type: 'object',
            properties: {
              totalMembers: { type: 'integer' },
              activeMemberships: { type: 'integer' },
              todayAttendance: { type: 'integer' },
              monthlyAttendance: { type: 'integer' },
              totalPlans: { type: 'integer' },
              totalAssets: { type: 'integer' },
              monthlyRevenue: { type: 'number' },
              monthlyExpenses: { type: 'number' },
              totalRevenue: { type: 'number' },
              totalExpenses: { type: 'number' },
              monthlyProfit: { type: 'number' }
            }
          }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  paths: {
    '/healthz': {
      get: {
        summary: 'Health Check',
        description: 'Check if the API is running',
        tags: ['System'],
        security: [],
        responses: {
          '200': {
            description: 'API is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean' },
                    service: { type: 'string' },
                    time: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'User Login',
        description: 'Authenticate user and get access token',
        tags: ['Authentication'],
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/api/members': {
      get: {
        summary: 'List Members',
        description: 'Get paginated list of members with search',
        tags: ['Members'],
        parameters: [
          { name: 'q', in: 'query', description: 'Search query', schema: { type: 'string' } },
          { name: 'page', in: 'query', description: 'Page number', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', description: 'Items per page', schema: { type: 'integer', default: 10 } }
        ],
        responses: {
          '200': {
            description: 'List of members',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    items: { type: 'array', items: { $ref: '#/components/schemas/Member' } },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    limit: { type: 'integer' }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create Member',
        description: 'Create a new member',
        tags: ['Members'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fullName'],
                properties: {
                  fullName: { type: 'string' },
                  phone: { type: 'string' },
                  gender: { type: 'string' },
                  dob: { type: 'string', format: 'date-time' },
                  photoUrl: { type: 'string' },
                  emergencyContact: { type: 'string' },
                  notes: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Member created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Member' }
              }
            }
          }
        }
      }
    },
    '/api/plans': {
      get: {
        summary: 'List Plans',
        description: 'Get all active plans',
        tags: ['Plans'],
        responses: {
          '200': {
            description: 'List of plans',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Plan' }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create Plan',
        description: 'Create a new membership plan',
        tags: ['Plans'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'price', 'durationDays'],
                properties: {
                  name: { type: 'string' },
                  price: { type: 'number' },
                  durationDays: { type: 'integer' },
                  isActive: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Plan created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Plan' }
              }
            }
          }
        }
      }
    },
    '/api/memberships': {
      post: {
        summary: 'Create Membership',
        description: 'Create a new membership for a member',
        tags: ['Memberships'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['memberId', 'planId', 'startDate'],
                properties: {
                  memberId: { type: 'string' },
                  planId: { type: 'string' },
                  startDate: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Membership created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Membership' }
              }
            }
          }
        }
      }
    },
    '/api/attendance/check-in': {
      post: {
        summary: 'Check In Member',
        description: 'Check in a member for gym attendance',
        tags: ['Attendance'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['memberId'],
                properties: {
                  memberId: { type: 'string' },
                  source: { type: 'string', enum: ['MANUAL', 'QR_CODE', 'FINGERPRINT'], default: 'MANUAL' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Check-in successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Attendance' }
              }
            }
          }
        }
      }
    },
    '/api/attendance/check-out': {
      post: {
        summary: 'Check Out Member',
        description: 'Check out a member from gym attendance',
        tags: ['Attendance'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['attendanceId'],
                properties: {
                  attendanceId: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Check-out successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Attendance' }
              }
            }
          }
        }
      }
    },
    '/api/payments': {
      get: {
        summary: 'List Payments',
        description: 'Get paginated list of payments',
        tags: ['Payments'],
        parameters: [
          { name: 'page', in: 'query', description: 'Page number', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', description: 'Items per page', schema: { type: 'integer', default: 10 } }
        ],
        responses: {
          '200': {
            description: 'List of payments',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    items: { type: 'array', items: { $ref: '#/components/schemas/Payment' } },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    limit: { type: 'integer' }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create Payment',
        description: 'Record a new payment',
        tags: ['Payments'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['memberId', 'amount'],
                properties: {
                  memberId: { type: 'string' },
                  membershipId: { type: 'string' },
                  amount: { type: 'number' },
                  method: { type: 'string', enum: ['CASH', 'CARD', 'BANK_TRANSFER', 'MOBILE_MONEY'], default: 'CASH' },
                  reference: { type: 'string' },
                  notes: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Payment created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Payment' }
              }
            }
          }
        }
      }
    },
    '/api/expenses': {
      get: {
        summary: 'List Expenses',
        description: 'Get paginated list of expenses',
        tags: ['Expenses'],
        parameters: [
          { name: 'page', in: 'query', description: 'Page number', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', description: 'Items per page', schema: { type: 'integer', default: 10 } }
        ],
        responses: {
          '200': {
            description: 'List of expenses',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    items: { type: 'array', items: { $ref: '#/components/schemas/Expense' } },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    limit: { type: 'integer' }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create Expense',
        description: 'Record a new expense',
        tags: ['Expenses'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['category', 'amount'],
                properties: {
                  category: { type: 'string', enum: ['ELECTRICITY', 'WATER', 'RENT', 'EQUIPMENT', 'MAINTENANCE', 'SUPPLIES', 'OTHER'] },
                  amount: { type: 'number' },
                  note: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Expense created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Expense' }
              }
            }
          }
        }
      }
    },
    '/api/assets': {
      get: {
        summary: 'List Assets',
        description: 'Get paginated list of assets with search and filtering',
        tags: ['Assets'],
        parameters: [
          { name: 'q', in: 'query', description: 'Search query', schema: { type: 'string' } },
          { name: 'category', in: 'query', description: 'Filter by category', schema: { type: 'string' } },
          { name: 'page', in: 'query', description: 'Page number', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', description: 'Items per page', schema: { type: 'integer', default: 10 } }
        ],
        responses: {
          '200': {
            description: 'List of assets',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    items: { type: 'array', items: { $ref: '#/components/schemas/Asset' } },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    limit: { type: 'integer' }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create Asset',
        description: 'Add a new asset to the gym inventory',
        tags: ['Assets'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'category', 'cost'],
                properties: {
                  name: { type: 'string' },
                  category: { type: 'string' },
                  serialNo: { type: 'string' },
                  purchaseDate: { type: 'string', format: 'date-time' },
                  cost: { type: 'number' },
                  condition: { type: 'string', enum: ['good', 'repair', 'bad'], default: 'good' },
                  location: { type: 'string' },
                  notes: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Asset created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Asset' }
              }
            }
          }
        }
      }
    },
    '/api/stats/overview': {
      get: {
        summary: 'Get Overview Statistics',
        description: 'Get comprehensive gym statistics and dashboard data',
        tags: ['Statistics'],
        responses: {
          '200': {
            description: 'Overview statistics',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/StatsOverview' }
              }
            }
          }
        }
      }
    }
  },
  tags: [
    { name: 'System', description: 'System health and status' },
    { name: 'Authentication', description: 'User authentication and authorization' },
    { name: 'Members', description: 'Member management operations' },
    { name: 'Plans', description: 'Membership plan management' },
    { name: 'Memberships', description: 'Member membership management' },
    { name: 'Attendance', description: 'Gym attendance tracking' },
    { name: 'Payments', description: 'Payment processing and tracking' },
    { name: 'Expenses', description: 'Gym expense management' },
    { name: 'Assets', description: 'Gym asset and equipment management' },
    { name: 'Statistics', description: 'Analytics and reporting' }
  ]
};


