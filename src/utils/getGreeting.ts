export function getGreeting(): { greeting: string; icon: string } {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return { greeting: "GOOD MORNING", icon: "☀️" };
  } else if (hour >= 12 && hour < 17) {
    return { greeting: "GOOD AFTERNOON", icon: "🌤️" };
  } else if (hour >= 17 && hour < 21) {
    return { greeting: "GOOD EVENING", icon: "🌆" };
  } else {
    return { greeting: "GOOD NIGHT", icon: "🌙" };
  }
}
