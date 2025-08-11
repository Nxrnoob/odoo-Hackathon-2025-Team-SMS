import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const sampleTrips = [
    {
      name: 'European Adventure',
      dateRange: 'Sep 10 - Sep 24, 2025',
      destinations: 4,
    },
    {
      name: 'Weekend in Tokyo',
      dateRange: 'Oct 5 - Oct 8, 2025',
      destinations: 1,
    },
    {
      name: 'Southeast Asia Backpacking',
      dateRange: 'Nov 1 - Nov 30, 2025',
      destinations: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, Traveler!</h1>
        <Button size="lg">Plan New Trip</Button>
      </header>

      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Upcoming Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleTrips.map((trip, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{trip.name}</CardTitle>
                <CardDescription>{trip.dateRange}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{trip.destinations} Destinations</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">View</Button>
                <Button variant="destructive">Delete</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
