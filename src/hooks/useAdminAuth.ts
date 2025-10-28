// hooks/useAdminAuth.ts
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function useAdminAuth(
  requiredRole: "super" | "biasa" = "biasa"
) {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<null | "super" | "biasa">(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return router.push("/login");

      const docRef = doc(db, "admins", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        router.push("/login");
        return;
      }

      const userRole = docSnap.data().role;
      setRole(userRole);

      // Cek akses role
      if (requiredRole === "super" && userRole !== "super") {
        alert("Anda tidak memiliki akses ke halaman ini.");
        router.push("/");
        return;
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { loading, role };
}
