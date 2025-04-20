'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from 'react-hot-toast';

interface SellerApplication {
  id: string;
  phone: string;
  shopName: string;
  location: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function SellerApplicationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (session?.user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchApplications();

    // Set up a refresh interval to poll for new applications
    const refreshInterval = setInterval(fetchApplications, 60000); // Refresh every minute
    
    return () => clearInterval(refreshInterval);
  }, [session, status, router]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/seller-applications');
      if (!response.ok) throw new Error('Failed to fetch applications');
      const data = await response.json();
      console.log('Fetched applications:', data.applications);
      setApplications(data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch('/api/admin/seller-applications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId,
          status: newStatus,
        }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      toast.success(`Application ${newStatus.toLowerCase()} successfully`);
      fetchApplications(); // Refresh the list
    } catch (error) {
      toast.error('Failed to update application status');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Seller Applications</h1>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Shop Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  {new Date(app.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{app.user.name}</TableCell>
                <TableCell>{app.user.email}</TableCell>
                <TableCell>{app.shopName}</TableCell>
                <TableCell>{app.location}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      app.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : app.status === 'APPROVED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }
                  >
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {app.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusUpdate(app.id, 'APPROVED')}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {applications.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No applications found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 