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
import { Plus } from "lucide-react";

export default function AddUserModal({
  formData,
  setFormData,
  loading,
  onCreateEmployee,
  open,
  setOpen,
}) {
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleMeasurementChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      measurements: { ...formData.measurements, [field]: value },
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2">
          <Plus size={18} />
          اضافه کردن کارمند جدید
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full h-full max-w-none sm:h-auto lg:max-w-6xl">
        <DialogHeader>
          <DialogTitle>مشخصات کارمند جدید</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={onCreateEmployee}
          className="space-y-4 max-h-[70vh] overflow-y-auto p-6"
        >
          <h2 className="font-bold text-lg">معلومات شخصی</h2>
          <fieldset className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">اسم</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label>جنسیت</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleChange("gender", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">مرد</SelectItem>
                  <SelectItem value="female">زن</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="age">سن</Label>
              <Input
                type="number"
                id="age"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">شماره تماس</Label>
              <Input
                type="text"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="department">بخش مربوطه</Label>
              <Input
                type="text"
                id="department"
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="role">نقش</Label>
              <Input
                type="text"
                id="role"
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="employmentStatus">وضیعت</Label>
              <Input
                type="text"
                id="employmentStatus"
                value={formData.role}
                onChange={(e) =>
                  handleChange("employmentStatus", e.target.value)
                }
              />
            </div>
          </fieldset>

          <h2 className="font-bold text-lg"> اندازه بدن</h2>
          <fieldset className="grid grid-cols-3 gap-4">
            {Object.entries(formData.measurements).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Label>
                <Input
                  type="text"
                  id={key}
                  value={value}
                  onChange={(e) => handleMeasurementChange(key, e.target.value)}
                />
              </div>
            ))}
          </fieldset>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              className="h-32"
              onChange={(e) => handleChange("notes", e.target.value)}
              maxLength={1000}
            />
          </div>

          <DialogFooter className="mt-4 gap-3">
            <Button type="submit">{loading ? "در حال ثبت ..." : "ثبت"}</Button>
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
