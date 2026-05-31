import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Orders } from './collections/Orders'
import { RmaRequests } from './collections/RmaRequests'
import { Subscribers } from './collections/Subscribers'
import { HomePage } from './globals/HomePage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' | Manasor Admin',
    },
    components: {
      graphics: {
        Logo: '@/components/AdminLogo',
        Icon: '@/components/AdminLogo',
      },
    },
    avatar: 'default',
  },

  collections: [Users, Media, Products, Orders, RmaRequests, Subscribers],

  globals: [HomePage],

  email: nodemailerAdapter({
    defaultFromAddress: 'info@manasor.com',
    defaultFromName: 'Manasor Destek',
    transportOptions: {
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ljvsmsdqhas2667j@ethereal.email',
        pass: 'u3NwwQ59B7kkUBvbse',
      },
    },
  }),

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || '',

  sharp,

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
