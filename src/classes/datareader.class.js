// Set up variables
class ExternalData {
  constructor() {
    this.parsed = []
    this.values = {'quat_w':'0', 'quat_x':'0', 'quat_y':'0', 'quat_z':'0',
                  'gyro_x':'0', 'gyro_y':'0', 'gyro_z':'0',
                  'mag_x':'0', 'mag_y':'0', 'mag_z':'0',
                  'accel':'0', 'accel_x':'0', 'accel_y':'0', 'accel_z':'0',
                  'temp':'0', 'pressure':'0',
                  'alt':'0', 'rh':'0',
                  'gps_fix':'0', 'latitude':'0', 'latitude_direction':'0', 'longitude':'0', 'longitude_direction':'0',
                  'speed':'0', 'angle':'0', 'gps_alt':'0', 'satellites':'0'
                 };
  }
  fetch(query) {
    this.parsed = Array.from({
      length: 20
    }, () => Math.floor(Math.random() * 20).toString());
    this.parsed.unshift("%%")

    switch (this.parsed[0]) {
      case "%%":
        this.values['quat_w'] = this.parsed[3];
        this.values['quat_x'] = this.parsed[4];
        this.values['quat_y'] = this.parsed[5];
        this.values['quat_z'] = this.parsed[6];
        this.values['mag_x'] = this.parsed[7];
        this.values['mag_y'] = this.parsed[8];
        this.values['mag_z'] = this.parsed[9];
        this.values['gyro_x'] = this.parsed[10];
        this.values['gyro_y'] = this.parsed[11];
        this.values['gyro_z'] = this.parsed[12];
        this.values['accel_x'] = this.parsed[13];
        this.values['accel_y'] = this.parsed[14];
        this.values['accel_z'] = this.parsed[15];
        this.values['accel'] = (Math.sqrt(this.parsed[13] ** 2 + this.parsed[14] ** 2 + this.parsed[15] ** 2) - 9.8).toString();
        break;
      case "!!":
        this.values['temp'] = this.parsed[3];
        this.values['pressure'] = this.parsed[4];
        this.values['alt'] = this.parsed[5];
        this.values['rh'] = this.parsed[6];
        break;
      case "$$":
        this.values['gps_fix'] = this.parsed[10];
        this.values['latitude'] = this.parsed[12];
        this.values['latitude_direction'] = this.parsed[13];
        this.values['longitude'] = this.parsed[14];
        this.values['longitude_direction'] = this.parsed[15];
        this.values['speed'] = this.parsed[16];
        this.values['angle'] = this.parsed[17];
        this.values['gps_alt'] = this.parsed[18];
        this.values['satellites'] = this.parsed[19];
        break;
      case "??":
        break;
      case "@@":
        this.values['CO2'] = this.parsed[3];
        this.values['TVOC'] = this.parsed[4];
        break;
      default:
        break;
    };
    if (!(query in this.values)){
      throw new Error("Key does not exist in function");
    }
    else{
      return this.values[query];
    }
  }
}

module.exports = {
  ExternalData
};