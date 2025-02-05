#define CANBUS_DRIVER_VERSION 1.0

#include <canbus_driver/canbus_driver.h>

namespace canbus_driver
{

  CanBusDriver::CanBusDriver(ros::NodeHandle *nh) : pcan_handle_(PCAN_USBBUS1), //  假設使用 PCAN-USB 設備 1
                                                    can_baud_rate_(PCAN_BAUD_250K),
                                                    ros_rate_(100)
  {
    // 初始化參數
    params.wheel_angle_lower_limit_ = -120;       // deg
    params.wheel_angle_upper_limit_ = 120;        // deg
    params.wheel_speed_lower_limit_ = -4000;      // rpm
    params.wheel_speed_upper_limit_ = 4000;       // rpm
    params.moter_current_upper_limit_ = 1000;     // A
    params.motor_temperature_lower_limit_ = -100; // °C
    params.motor_temperature_upper_limit_ = 300;  // °C

    params.wheel_radius_ = 0.15; // meter
    params.wheel_reduction_ratio_ = 21.96;

    params.wheel_angle_offset_ = 0.0; // deg

    i_ = j_ = 0;

    // 顯示版本
    ROS_INFO_STREAM("CANBUS_DRIVER_VERSION " << CANBUS_DRIVER_VERSION);

    // 初始化各項功能
    while (!initCanBus(pcan_handle_, can_baud_rate_))
    {
      ROS_ERROR_STREAM("PCAN-USB initialization failed!");
      ros::Duration(1.0).sleep();
    }
    ROS_INFO_STREAM("PCAN-USB  initialized successfully!");

    while (!initPublisher(nh))
    {
      ROS_ERROR_STREAM("Publisher initialization failed!");
      ros::Duration(1.0).sleep();
    }
    ROS_INFO_STREAM("Publisher initialized successfully!");

    while (!initSubsriber(nh))
    {
      ROS_ERROR_STREAM("Subsriber initialization failed!");
      ros::Duration(1.0).sleep();
    }
    ROS_INFO_STREAM("Subsriber initialized successfully!");

    // 啟動通信執行緒
    std::thread t(&CanBusDriver::sendMsgThread, this);
    t.detach(); // 開始非阻塞執行緒
    std::thread d(&CanBusDriver::receiveMsgThread, this);
    d.detach(); // 開始非阻塞執行緒

    ROS_INFO_STREAM("Start canbus driver node...");

    std::thread w(&CanBusDriver::sendMsgToCurtis, this);
    // w.detach();  // 開始非阻塞執行緒
  }

  CanBusDriver::~CanBusDriver()
  {
    // 在析構時關閉 PCAN-USB
    CAN_Uninitialize(pcan_handle_);
    ROS_INFO_STREAM("PCAN-USB uninitialized.");
  }

  bool CanBusDriver::initCanBus(TPCANHandle handler, uint16_t baud_rate)
  {
    // 初始化 PCAN-USB 設備
    TPCANStatus status = CAN_Initialize(handler, baud_rate, 0, 0, 0);
    if (status != PCAN_ERROR_OK)
    {
      ROS_ERROR_STREAM("Error initializing PCAN device: " << status);
      return false;
    }
    else
    {
      return true;
    }
  }

  bool CanBusDriver::initPublisher(ros::NodeHandle *nh)
  {
    wheel_velocity_pub_ = nh->advertise<std_msgs::Float32>("canbus/get_wheel_velocity", 1000);
    wheel_angle_pub_ = nh->advertise<std_msgs::Float32>("canbus/get_wheel_angle", 1000);
    error_message_pub_ = nh->advertise<std_msgs::String>("canbus/get_error_message", 1000);
    motor_current_pub_ = nh->advertise<std_msgs::Float32>("canbus/get_motor_current", 1000);
    motor_driver_temperature_pub_ = nh->advertise<std_msgs::Float32>("canbus/get_motor_driver_temperature", 1000);
    return true;
  }

  void CanBusDriver::pubWheelVelocity(float velocity)
  {
    std_msgs::Float32 msg;
    msg.data = velocity;
    wheel_velocity_pub_.publish(msg);
  }

  void CanBusDriver::pubWheelAngle(float angle)
  {
    std_msgs::Float32 msg;
    msg.data = angle;
    wheel_angle_pub_.publish(msg);
  }

  void CanBusDriver::pubErrorMessages(std::string errorMsg)
  {
    std_msgs::String msg;
    msg.data = errorMsg;
    error_message_pub_.publish(msg);
  }

  void CanBusDriver::pubMotorCurrent(float motorCurrent)
  {
    std_msgs::Float32 msg;
    msg.data = motorCurrent;
    motor_current_pub_.publish(msg);
  }

  void CanBusDriver::pubMotorDriverTemperature(float motorDriverTemperature)
  {
    std_msgs::Float32 msg;
    msg.data = motorDriverTemperature;
    motor_driver_temperature_pub_.publish(msg);
  }

  bool CanBusDriver::initSubsriber(ros::NodeHandle *nh)
  {
    cmd_vel_sub_ = nh->subscribe("canbus/set_wheel_cmd_vel", 10, &CanBusDriver::cmdVelCallback, this);
    fork_rise_enable_sub_ = nh->subscribe("canbus/set_fork_rise_enable", 10, &CanBusDriver::forkRiseEnableCallback, this);
    fork_fall_enable_sub_ = nh->subscribe("canbus/set_fork_fall_enable", 10, &CanBusDriver::forkFallEnableCallback, this);
    return true;
  }

  void CanBusDriver::cmdVelCallback(const geometry_msgs::Twist::ConstPtr &msg)
  {

    // msg->linear.x

    // msg->angular.z
  }

  void CanBusDriver::forkRiseEnableCallback(const std_msgs::Bool::ConstPtr &msg)
  {

    ros::Rate rate(1); // Set rate to 1 Hz (sleep 1 second per iteration)
    while (i_ < 10)
    {
      ROS_INFO_STREAM("a " << i_);
      i_++;
      rate.sleep();
      // ros::spinOnce();  // Allow callback processing
    }
  }

  void CanBusDriver::forkFallEnableCallback(const std_msgs::Bool::ConstPtr &msg)
  {

    ros::Rate rate(1); // Set rate to 1 Hz (sleep 1 second per iteration)
    while (j_ < 10)
    {
      ROS_INFO_STREAM("bb " << j_);
      j_++;
      rate.sleep();
      ros::spinOnce(); // Allow callback processing
    }
  }

  // void CanBusDriver::sendMsgToCurtis() {
  //      // Create a CanBusCmd message for linear velocity
  //     // CanBusCmd linear_msg;
  //     // linear_msg.can_id = DeviceID::StmBoard;
  //     // linear_msg.can_dlc = sizeof(double); // float64
  //     // linear_msg.msg_type = MSGTYPE_STANDARD;
  //     // memcpy(linear_msg.can_data, &msg->linear.x, linear_msg.can_dlc);
  //     // addMsgToQueue(linear_msg);

  //     // Create a CanBusCmd message for angular
  //     // CanBusCmd angle_msg;
  //     // angle_msg.can_id = DeviceID::WheelAngle;
  //     // angle_msg.can_dlc = sizeof(double); // float64
  //     // angle_msg.msg_type = MSGTYPE_STANDARD;
  //     // memcpy(angle_msg.can_data, &msg->angular.z, angle_msg.can_dlc);
  //     // addMsgToQueue(angle_msg);

  // }

  void CanBusDriver::sendMsgToCurtis()
  {
    ros::Rate rate(ros_rate_); // Create rate object with desired rate (Hz)

    while (i_ + j_ < 60)
    {                  // Continue looping until the sum of i_ and j_ is at least 60
      int q = i_ + j_; // Recalculate q on each iteration based on updated i_ and j_

      ROS_INFO_STREAM("qq " << q); // Print the current value of q
      rate.sleep();                // Sleep based on rate
      ros::spinOnce();             // Call the callback queue processing
    }
  }

  void CanBusDriver::addMsgToQueue(CanBusCmd newMsg)
  {
    queue_mutex_.lock();
    msg_queue_.push(newMsg);
    queue_mutex_.unlock();
  }

  void CanBusDriver::sendMsgThread()
  {
    float sleep_time = 1.0 / ros_rate_;
    while (ros::ok())
    {
      //? early return
      if (msg_queue_.size() == 0)
      {
        ros::Duration(sleep_time).sleep();
        continue;
      }

      queue_mutex_.lock();
      CanBusCmd send_msg = msg_queue_.front();
      msg_queue_.pop();
      queue_mutex_.unlock();

      // 發送訊息
      TPCANMsg msg; // 用來存放發送的訊息
      msg.ID = send_msg.can_id;
      msg.LEN = send_msg.can_dlc;
      msg.MSGTYPE = send_msg.msg_type;
      memcpy(msg.DATA, &send_msg.can_data, send_msg.can_dlc);

      // 發送訊息
      TPCANStatus status = CAN_Write(pcan_handle_, &msg);
      if (status != PCAN_ERROR_OK)
      {
        ROS_ERROR_STREAM("Error sending CAN message: " << status);
        pubErrorMessages("Error sending CAN message");
      }
      else
      {
        ROS_INFO_STREAM("Message sent successfully!");
      }
      ros::Duration(sleep_time).sleep();
    }
  }

  void CanBusDriver::receiveMsgThread()
  {
    TPCANMsg msg;             // 用來存放發送的訊息
    TPCANTimestamp timestamp; // 用來存放接收訊息的時間戳
    while (ros::ok())
    {
      // 接收訊息
      TPCANMsg receivedMsg;
      TPCANStatus status = CAN_Read(pcan_handle_, &receivedMsg, &timestamp);
      if (status != PCAN_ERROR_OK)
        continue;

      ROS_INFO_STREAM("Receive canbus message from " << "0x" << std::hex << (int)receivedMsg.ID);

      switch (receivedMsg.ID)
      {
      case DeviceID::Curtis0x183:
        handleMsg183(receivedMsg.LEN, receivedMsg.DATA);
        break;
      case DeviceID::Curtis0x283:
        handleMsg283(receivedMsg.LEN, receivedMsg.DATA);
        break;
      case DeviceID::Curtis0x383:
        handleMsg383(receivedMsg.LEN, receivedMsg.DATA);
        break;
      default:
        ROS_WARN_STREAM("receive unknow message ID : " << "0x" << std::hex << (int)receivedMsg.ID);
        break;
      }

      // ROS_INFO_STREAM("Timestamp: " << timestamp.millis << " ms");
    }
  }

  void CanBusDriver::handleMsg183(unsigned char length, unsigned char data[8])
  {
    short motor_speed = (data[1] << 8) | data[0];                                                               // rpm
    wheel_velocity_ = 2.0 * M_PI * params.wheel_radius_ * motor_speed / (60.0 * params.wheel_reduction_ratio_); // 2*pi*r*rpm/60 = m/s
    if (motor_speed < params.wheel_speed_lower_limit_ || params.wheel_speed_upper_limit_ < motor_speed)
    {
      std::stringstream ss;
      ss << "[Steering speed] : Error " << motor_speed << " rpm";
      ROS_ERROR_STREAM(ss.str());
      pubErrorMessages(ss.str());
    }
    else
    {
      ROS_INFO_STREAM("[Steering speed] : " << motor_speed << " rpm");
      ROS_INFO_STREAM("[Steering velocity] : " << wheel_velocity_ << " m/s");
      pubWheelVelocity(wheel_velocity_);
    }

    short raw_current = (data[3] << 8) | data[2];
    float current = raw_current / 10.0;
    if (0 <= current || current <= params.moter_current_upper_limit_)
    {
      ROS_INFO_STREAM("[Motor Current] : " << current << " A");
      pubMotorCurrent(current);
    }
    else
    {
      std::stringstream ss;
      ss << "[Motor Current] : Error " << current << " A";
      ROS_ERROR_STREAM(ss.str());
      pubErrorMessages(ss.str());
    }

    if (0x12 <= (int)data[4] && (int)data[4] <= 0xc6)
    {
      std::stringstream ss;
      ss << "[Steering] : Error " << "0x" << std::setw(2) << std::setfill('0') << std::hex << (int)data[4];
      ROS_ERROR_STREAM(ss.str());
      pubErrorMessages(ss.str());
    }

    short raw_temperature = (data[7] << 8) | data[6];
    float temperature = raw_temperature / 10.0;
    if (params.motor_temperature_lower_limit_ <= temperature && temperature <= params.motor_temperature_upper_limit_)
    {
      ROS_INFO_STREAM("[Motor Driver Temperature] : " << temperature << " 'C");
      pubMotorDriverTemperature(temperature);
    }
    else
    {
      std::stringstream ss;
      ss << "[Motor Driver Temperature] : Error " << temperature << " 'C";
      ROS_ERROR_STREAM(ss.str());
      pubErrorMessages(ss.str());
    }
  }

  void CanBusDriver::handleMsg283(unsigned char length, unsigned char data[8])
  {
    int travel_distance = (data[3] << 24) | (data[2] << 16) | (data[1] << 8) | data[0];
    ROS_INFO_STREAM("[Travel Odometer Encoder] : " << travel_distance << " cm");

    unsigned char bit0 = (data[6] >> 0) & 0x1;
    unsigned char bit2 = (data[6] >> 2) & 0x1;
    unsigned char bit3 = (data[6] >> 3) & 0x1;

    if ((int)bit0 == 0)
    {
      ROS_INFO_STREAM("[Emergency Stop] : Software");
    }
    else
    {
      ROS_INFO_STREAM("[Emergency Stop] : Hardware");
    }

    if ((int)bit2)
    {
      ROS_INFO_STREAM("[Wheel Direction] : Forward");
    }

    if ((int)bit3)
    {
      ROS_INFO_STREAM("[Wheel Direction] : Backward");
    }
  }

  void CanBusDriver::handleMsg383(unsigned char length, unsigned char data[8])
  {
    short raw_angle = (data[1] << 8) | data[0];
    float angle = raw_angle / 100.0;
    if (angle < params.wheel_angle_lower_limit_ || params.wheel_angle_upper_limit_ < angle)
    {
      std::stringstream ss;
      ss << "[Steering angle] : Error " << angle << " deg";
      ROS_ERROR_STREAM(ss.str());
      pubErrorMessages(ss.str());
    }
    else
    {
      ROS_INFO_STREAM("[Steering angle] : " << angle << " deg (raw data)");
      wheel_angle_ = angle + params.wheel_angle_offset_;
      ROS_INFO_STREAM("[Steering angle] : " << wheel_angle_ << " deg (with offset)");
      pubWheelAngle(wheel_angle_);
    }

    if (11 < (int)data[3] && (int)data[3] < 76)
    {
      std::stringstream ss;
      ss << "[Steering angle] Error Code : " << "0x" << std::setw(2) << std::setfill('0') << std::hex << (int)data[3];
      ROS_ERROR_STREAM(ss.str());
      pubErrorMessages(ss.str());
    }
  }

}; // end namespace canbus_driver

int main(int argc, char **argv)
{
  ros::init(argc, argv, "canbus_driver_node");
  ros::NodeHandle nh;
  canbus_driver::CanBusDriver cadriverr(&nh);
  ros::spin();
  return 0;
}
