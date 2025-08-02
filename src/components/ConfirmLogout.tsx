import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/contexts/AuthContext";

function ConfirmLogout() {
  const { logout } = useAuth();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">خروج</Button>
      </AlertDialogTrigger>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            آیا مطمین هستید که میخواهید خارج شوید؟
          </AlertDialogTitle>
          <AlertDialogDescription>
            با این کار از صفحه کاربر خارج شده و به صحفه ورود هدایت خواهید شد
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel>لغو</AlertDialogCancel>
          <AlertDialogAction onClick={logout}>تایید خروج</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default ConfirmLogout;
