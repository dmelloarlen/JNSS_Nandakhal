import toast from "react-hot-toast";

export function timeBasedGreetingToast() {
  const now = new Date();
  const hour = now.getHours();

  let greeting = "";
  let key = "";

  if (hour >= 5 && hour < 12) {
    greeting = "🌅 Good Morning";
    key = "morning";
  } else if (hour >= 12 && hour < 17) {
    greeting = "☀️ Good Afternoon";
    key = "afternoon";
  } else if (hour >= 17 && hour < 21) {
    greeting = "🌇 Good Evening";
    key = "evening";
  } else {
    greeting = "🌙 Good Night";
    key = "night";
  }

  const today = new Date().toISOString().split("T")[0];
  const storageKey = `greeted-${key}-${today}`;

  if (!localStorage.getItem(storageKey)) {
    toast(greeting,{duration: 6000});
    localStorage.setItem(storageKey, "true");
  }
}