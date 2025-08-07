import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { employeesAPI } from "@/services/api";

// Persian labels for measurement fields
const MEASUREMENT_LABELS: Record<string, string> = {
  chest: "دور سینه",
  waist: "دور کمر",
  hip: "دور باسن",
  inseam: "طول داخل پا",
  sleeveLength: "طول آستین",
  shoulderWidth: "عرض شانه",
  neck: "دور گردن",
  height: "قد",
  weight: "وزن",
  armLength: "طول بازو",
  thigh: "دور ران",
  claf: "دور ساق پا",
  wrist: "دور مچ دست",
  ankle: "دور مچ پا",
};

interface Measurement {
  [key: string]: string;
}

interface EmployeeData {
  name: string;
  gender: string;
  age: string;
  phone: string;
  department: string;
  role: string;
  measurements: Measurement;
  notes: string;
}

interface EditEmployeeProps {
  id: string;
  fetchData: () => void;
}

export default function EditEmployee({ id, fetchData }: EditEmployeeProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EmployeeData>({
    name: "",
    gender: "",
    age: "",
    phone: "",
    department: "",
    role: "",
    measurements: {
      chest: "",
      waist: "",
      hip: "",
      inseam: "",
      sleeveLength: "",
      shoulderWidth: "",
      neck: "",
      height: "",
      weight: "",
      armLength: "",
      thigh: "",
      claf: "",
      wrist: "",
      ankle: "",
    },
    notes: "",
  });

  useEffect(() => {
    if (open) fetchEmployeeData();
  }, [open]);

  const fetchEmployeeData = async () => {
    try {
      const response = await employeesAPI.fetchEmployeeData(id);
      setFormData(response);
    } catch (error) {
      console.error("Error while fetching data", error);
    }
  };

  const handleChange = (field: keyof EmployeeData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMeasurementChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      measurements: { ...prev.measurements, [field]: value },
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await employeesAPI.updateEmployee(id, formData);
      fetchData();
      setOpen(false);
    } catch (error) {
      console.error("Failed to update employee:", error);
    } finally {
      setLoading(false);
    }
  };

  const personalFields = [
    { label: "اسم", id: "name" },
    { label: "سن", id: "age", type: "number" },
    { label: "شماره تماس", id: "phone" },
    { label: "بخش مربوطه", id: "department" },
    { label: "نقش", id: "role" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4 text-purple-500" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full h-full max-w-none sm:h-auto lg:max-w-6xl">
        <DialogHeader>
          <DialogTitle>مشخصات کارمند</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleUpdate}
          className="space-y-4 max-h-[70vh] overflow-y-auto p-6"
        >
          {/* Personal Info */}
          <h2 className="font-bold text-lg">معلومات شخصی</h2>
          <fieldset className="grid grid-cols-3 gap-4">
            {personalFields.map(({ label, id, type = "text" }) => (
              <div key={id}>
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  type={type}
                  value={(formData as any)[id]}
                  onChange={(e) =>
                    handleChange(id as keyof EmployeeData, e.target.value)
                  }
                  required={id === "name"}
                />
              </div>
            ))}

            <div>
              <Label>جنسیت</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="جنسیت را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">مرد</SelectItem>
                  <SelectItem value="female">زن</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </fieldset>

          {/* Body Measurements */}
          <h2 className="font-bold text-lg">اندازه بدن</h2>
          <fieldset className="grid grid-cols-3 gap-4">
            {Object.entries(formData.measurements).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={key}>{MEASUREMENT_LABELS[key] || key}</Label>
                <Input
                  id={key}
                  type="text"
                  value={value}
                  onChange={(e) => handleMeasurementChange(key, e.target.value)}
                />
              </div>
            ))}
          </fieldset>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">یادداشت</Label>
            <Textarea
              id="notes"
              className="h-32"
              maxLength={1000}
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>

          {/* Footer */}
          <DialogFooter className="mt-4 gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "در حال ثبت ..." : "ثبت"}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              لغو
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
