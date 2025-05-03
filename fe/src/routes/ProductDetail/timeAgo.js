const timeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const secondsPast = (now.getTime() - past.getTime()) / 1000;
  
    if (secondsPast < 60) {
      return "vừa xong";
    }
    if (secondsPast < 3600) {
      const minutes = Math.floor(secondsPast / 60);
      return `${minutes} phút trước`;
    }
    if (secondsPast < 86400) {
      const hours = Math.floor(secondsPast / 3600);
      return `${hours} giờ trước`;
    }
    if (secondsPast < 2592000) {
      const days = Math.floor(secondsPast / 86400);
      return `${days} ngày trước`;
    }
    if (secondsPast < 31104000) {
      const months = Math.floor(secondsPast / 2592000);
      return `${months} tháng trước`;
    }
    const years = Math.floor(secondsPast / 31104000);
    return `${years} năm trước`;
  };
  
  export default timeAgo;
  