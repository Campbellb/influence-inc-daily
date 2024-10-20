export function getPlayerImage(level: number): string {
  switch (level) {
    case 1:
      return "/intern.png";
    case 2:
      return "/employee.png";
    case 3:
      return "/manager.png";
    case 4:
      return "/senior_associate.png";
    case 5:
      return "/manager.png";
    case 6:
      return "/senior_manager.png";
    case 7:
      return "/director.png";
    case 8:
      return "/vice_president.png";
    case 9:
      return "/senior_vice_president.png";
    case 10:
      return "/executive.png";
    default:
      return "/default_player.png";
  }
}
