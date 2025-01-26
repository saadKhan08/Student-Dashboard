import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, Pencil, Trash, Users, GraduationCap, BookOpen, Award } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';

interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  address: string;
  phone: string;
  email: string;
  parentName: string;
  parentPhone: string;
  dateOfBirth: string;
  bloodGroup: string;
  admissionDate: string;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    section: '',
    rollNumber: '',
    address: '',
    phone: '',
    email: '',
    parentName: '',
    parentPhone: '',
    dateOfBirth: '',
    bloodGroup: '',
    admissionDate: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      console.log('Fetching students...');
      const querySnapshot = await getDocs(collection(db, 'students'));
      const studentsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Create a plain JavaScript object with explicit property assignments
        const plainStudent: Student = {
          id: doc.id,
          name: String(data.name || ''),
          class: String(data.class || ''),
          section: String(data.section || ''),
          rollNumber: String(data.rollNumber || ''),
          address: String(data.address || ''),
          phone: String(data.phone || ''),
          email: String(data.email || ''),
          parentName: String(data.parentName || ''),
          parentPhone: String(data.parentPhone || ''),
          dateOfBirth: String(data.dateOfBirth || ''),
          bloodGroup: String(data.bloodGroup || ''),
          admissionDate: String(data.admissionDate || '')
        };
        console.log('Processed student data:', plainStudent);
        return plainStudent;
      });
      
      console.log('All students processed:', studentsData);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch students",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Student name is required",
        });
        return;
      }

      if (!formData.class.trim()) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Class is required",
        });
        return;
      }

      if (!formData.rollNumber.trim()) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Roll number is required",
        });
        return;
      }

      console.log('Submitting student data:', formData);
      
      // Create a plain JavaScript object for submission
      const studentData = {
        ...formData,
        createdAt: new Date().toISOString()
      };
      
      // Add the document to Firestore
      await addDoc(collection(db, 'students'), studentData);
      
      // Reset form
      setFormData({
        name: '',
        class: '',
        section: '',
        rollNumber: '',
        address: '',
        phone: '',
        email: '',
        parentName: '',
        parentPhone: '',
        dateOfBirth: '',
        bloodGroup: '',
        admissionDate: '',
      });
      
      // Close dialog
      setIsOpen(false);
      
      // Refresh students list
      await fetchStudents();
      
      // Show success message
      toast({
        title: "Success",
        description: "Student added successfully",
      });
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add student",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('Deleting student with ID:', id);
      await deleteDoc(doc(db, 'students', id));
      console.log('Student deleted successfully');
      fetchStudents();
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete student",
      });
    }
  };

  // Mock data for charts
  const classDistribution = [
    { month: 'Jan', class10: 30, class11: 45 },
    { month: 'Feb', class10: 35, class11: 60 },
    { month: 'Mar', class10: 25, class11: 45 },
    { month: 'Apr', class10: 35, class11: 55 },
    { month: 'May', class10: 45, class11: 40 },
    { month: 'Jun', class10: 45, class11: 35 },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add Student</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter student name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class *</Label>
                <Input
                  id="class"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  required
                  placeholder="Enter class"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  required
                  placeholder="Enter section"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  required
                  placeholder="Enter roll number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  placeholder="Enter address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="Enter email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentName">Parent Name</Label>
                <Input
                  id="parentName"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  required
                  placeholder="Enter parent name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentPhone">Parent Phone</Label>
                <Input
                  id="parentPhone"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  required
                  placeholder="Enter parent phone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Input
                  id="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  required
                  placeholder="Enter blood group"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admissionDate">Admission Date</Label>
                <Input
                  id="admissionDate"
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="col-span-2 mt-4">
                Submit
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value={students.length}
          change="+2.5%"
          icon={<Users className="w-6 h-6 text-primary" />}
          className="bg-blue-50"
        />
        <StatsCard
          title="Average Attendance"
          value="85%"
          change="-0.1%"
          icon={<GraduationCap className="w-6 h-6 text-primary" />}
          className="bg-purple-50"
        />
        <StatsCard
          title="Classes"
          value="12"
          change="+2.8%"
          icon={<BookOpen className="w-6 h-6 text-primary" />}
          className="bg-yellow-50"
        />
        <StatsCard
          title="Top Performers"
          value="24"
          change="+3.6%"
          icon={<Award className="w-6 h-6 text-primary" />}
          className="bg-red-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Class Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classDistribution}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip />
                <Bar dataKey="class10" fill="#4F46E5" name="Class 10" />
                <Bar dataKey="class11" fill="#818CF8" name="Class 11" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Students List</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4 text-left font-medium">ID</th>
                  <th className="p-4 text-left font-medium">Name</th>
                  <th className="p-4 text-left font-medium">Class</th>
                  <th className="p-4 text-left font-medium">Section</th>
                  <th className="p-4 text-left font-medium">Roll Number</th>
                  <th className="p-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id} className="border-t">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">{student.name}</td>
                    <td className="p-4">{student.class}</td>
                    <td className="p-4">{student.section}</td>
                    <td className="p-4">{student.rollNumber}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(student.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;