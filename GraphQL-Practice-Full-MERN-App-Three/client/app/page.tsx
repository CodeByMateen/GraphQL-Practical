import { Users } from '../components/Users';
import { Tasks } from '../components/Tasks';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">GraphQL Practice App</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Users />
          </div>
          <div>
            <Tasks />
          </div>
        </div>
      </main>
    </div>
  );
}
