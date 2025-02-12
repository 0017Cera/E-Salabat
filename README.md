# e-Salabat IoT Dashboard

A modern web application for monitoring and controlling an IoT-based ginger tea (salabat) production system.

## Features

- **Real-time Monitoring**
  - Temperature tracking
  - Humidity monitoring
  - Grinding speed control
  - Production output analytics

- **Machine Control**
  - Juicer control
  - Valve management
  - Heat level adjustment
  - Mixer speed control
  - Grinder speed settings
  - Cooking timer

- **System Management**
  - User authentication
  - Maintenance scheduling
  - System logs
  - Quality metrics tracking

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Recharts for data visualization
- Supabase for authentication
- Vite for development and building

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update Supabase credentials

4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/          # Page components
├── lib/            # Utilities and configurations
└── main.tsx        # Application entry point
```

## Authentication

The application uses Supabase for user authentication. Default test credentials:
- Email: admin@email.com
- Password: password

## License

MIT
