import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { employeesAPI } from "@/services/api";

// Persian labels for measurements
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

interface Props {
  employeeId: string;
}

export default function EmployeeDetails({ employeeId }: Props) {
  const [open, setOpen] = useState(false);
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    employeesAPI
      .fetchEmployeeData(employeeId)
      .then((data) => {
        setEmployee(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error loading employee:", err);
        setError("خطا در بارگذاری اطلاعات");
      })
      .finally(() => setLoading(false));
  }, [open, employeeId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="w-4 h-4 text-sky-600" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full h-full max-w-none sm:h-auto lg:max-w-6xl">
        <DialogHeader>
          <DialogTitle>جزییات کارمند</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="p-4 text-center">در حال بارگذاری...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-600">{error}</div>
        ) : employee ? (
          <ScrollArea className="max-h-[60vh] pr-2">
            <section className="space-y-6 text-sm">
              <div>
                <h2 className="font-semibold mb-2">معلومات شخصی</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Field label="اسم" value={employee.name} />
                  <Field
                    label="جنسیت"
                    value={employee.gender === "male" ? "مرد" : "زن"}
                  />
                  <Field label="سن" value={employee.age} />
                  <Field label="شماره تماس" value={employee.phone} />
                  <Field label="بخش مربوطه" value={employee.department} />
                  <Field label="نقش" value={employee.role} />
                </div>
              </div>

              <div>
                <h2 className="font-semibold mb-2">اندازه بدن</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(employee.measurements).map(([key, val]) => (
                    <Field
                      key={key}
                      label={MEASUREMENT_LABELS[key] || key}
                      value={val}
                    />
                  ))}
                </div>
              </div>

              {employee.notes && (
                <div>
                  <h2 className="font-semibold mb-2">یادداشت</h2>
                  <p className="bg-muted p-3 rounded text-xs whitespace-pre-wrap border">
                    {employee.notes}
                  </p>
                </div>
              )}
            </section>
          </ScrollArea>
        ) : (
          <div className="p-4 text-center">هیچ اطلاعاتی موجود نیست</div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            بستن
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span>{value || "—"}</span>
    </div>
  );
}
