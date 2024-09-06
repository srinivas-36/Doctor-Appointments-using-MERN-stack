import React from "react";
import convertTime from "../../utils/convertTime";
import axios from "axios";
import { BASE_URL, token } from "../../config.js";
import { toast } from "react-toastify";

const Sidepanel = ({ doctorId, ticketPrice, timeSlots }) => {
  const bookingHandler = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/bookings/checkout-success/${doctorId}`,
        {}, // Empty object as the second argument for the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      if (data.session.url) {
        window.location.href = data.session.url;
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  return (
    <div className="shadow-panelShadow p-3 lg:p-5 rounded-md">
      <div className="flex items-center justify-between">
        <p className="text__para mt-0 font-semibold ">Ticket price</p>
        <span className="text-[16px] leading-7 lg:leading-8 text-headingColor font-bold">
          {ticketPrice} USD
        </span>
      </div>

      <div className="mt-[30px]">
        <p className="text__para mt-0 font-semibold text-headingColor">
          Available Time Solts :
        </p>

        <ul className="mt-3">
          {timeSlots?.map((item, index) => (
            <li key={index} className="flex items-center justify-between mb-2">
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                {item.day.charAt(0).toUpperCase() + item.day.slice(1)}
              </p>
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                {convertTime(item.startingTime)} -{" "}
                {convertTime(item.endingTime)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={bookingHandler} className="btn px-2 w-full rounded-md">
        Book Appointment
      </button>
    </div>
  );
};

export default Sidepanel;
