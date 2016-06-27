module.exports = {
  getMonthName(m) {
    var strMonth = null;
      if (m == '01') strMonth = 'มกราคม';
      if (m == '02') strMonth = 'กุมภาพันธุ์';
      if (m == '03') strMonth = 'มีนาคม';
      if (m == '04') strMonth = 'เมษายน';
      if (m == '05') strMonth = 'พฤษภาคม';
      if (m == '06') strMonth = 'มิถุนายน';
      if (m == '07') strMonth = 'กรกฎาคม';
      if (m == '08') strMonth = 'สิงหาคม';
      if (m == '09') strMonth = 'กันยายน';
      if (m == '10') strMonth = 'ตุลาคม';
      if (m == '11') strMonth = 'พฤศจิกายน';
      if (m == '12') strMonth = 'ธันวาคม';

      return strMonth;
  }
}