import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Passenger {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
}

interface FlightSegment {
    id: number;
    flightId: number;
    from: string;
    to: string;
    date: string;
    departure_time: string;
    arrival_time: string;
    price: number;
    noflight: string;
}

interface BookingData {
    outbound: FlightSegment;
    return?: FlightSegment;
    passengers: {
        adults: number;
        children: number;
        infants: number;
    };
    passengersData: {
        adults: Passenger[];
        children: Passenger[];
        infants: Passenger[];
    };
    tripType: string;
    totalPrice: number;
    fromCity: string;
    toCity: string;
    from: string;
    to: string;
    bookingReference?: string;
}
const Stepper = ({ currentStep }: { currentStep: number }) => {
    return (
        <div className="relative mb-10 px-6">
            <div className="absolute left-[14%] right-[14%] top-2 z-0 h-0.5 bg-blue-500" />
            <div className="relative z-10 flex items-center justify-between">
                {["Flight", "Passenger", "Pay", "Confirmation"].map((step, idx) => {
                    const isCompleted = idx < currentStep;
                    const isActive = idx === currentStep;

                    return (
                        <div
                            key={idx}
                            className="flex w-1/4 flex-col items-center text-center text-sm"
                        >
                            <div
                                className={`relative z-10 mb-2 h-4 w-4 rounded-full border-2 ${
                                    isActive
                                        ? "border-blue-500 bg-red-500"
                                        : isCompleted
                                          ? "border-blue-500 bg-blue-500"
                                          : "border-blue-500 bg-slate-50"
                                }`}
                            >
                                {isCompleted && (
                                    <svg
                                        className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                )}
                            </div>
                            <span
                                className={`whitespace-nowrap ${
                                    isActive ? "font-bold text-blue-500" : isCompleted ? "text-blue-500" : "text-blue-500"
                                }`}
                            >
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
const generateEmailContent = (bookingData: BookingData, bookingReference: string): string => {
    const outboundFlight = bookingData.outbound;
    const returnFlight = bookingData.return;

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f0f7ff; padding: 20px; text-align: center; border-radius: 5px; }
        .flight-card { border: 1px solid #ddd; border-radius: 5px; padding: 15px; margin-bottom: 20px; }
        .flight-header { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        .flight-details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .passenger-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .passenger-table th, .passenger-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .passenger-table th { background-color: #f2f2f2; }
        .footer { margin-top: 30px; font-size: 12px; color: #777; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Flight Booking Confirmation</h1>
          <p>Booking Reference: <strong>${bookingReference}</strong></p>
        </div>
        
        <h2>Flight Details</h2>
        
        <div class="flight-card">
          <div class="flight-header">Outbound Flight</div>
          <div class="flight-details">
            <div>
              <strong>From:</strong> ${bookingData.fromCity} (${bookingData.from})<br>
              <strong>To:</strong> ${bookingData.toCity} (${bookingData.to})<br>
              <strong>Date:</strong> ${new Date(outboundFlight.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
            <div>
              <strong>Departure:</strong> ${outboundFlight.departure_time}<br>
              <strong>Arrival:</strong> ${outboundFlight.arrival_time}<br>
              <strong>Flight Number:</strong> ${outboundFlight.noflight}
            </div>
          </div>
        </div>
        
        ${
            returnFlight
                ? `
        <div class="flight-card">
          <div class="flight-header">Return Flight</div>
          <div class="flight-details">
            <div>
              <strong>From:</strong> ${bookingData.toCity} (${bookingData.to})<br>
              <strong>To:</strong> ${bookingData.fromCity} (${bookingData.from})<br>
              <strong>Date:</strong> ${new Date(returnFlight.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
            <div>
              <strong>Departure:</strong> ${returnFlight.departure_time}<br>
              <strong>Arrival:</strong> ${returnFlight.arrival_time}<br>
              <strong>Flight Number:</strong> ${returnFlight.noflight}
            </div>
          </div>
        </div>
        `
                : ""
        }
        
        <h2>Passenger Information</h2>
        <table class="passenger-table">
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Email</th>
          </tr>
          ${bookingData.passengersData?.adults
              ?.map(
                  (passenger: Passenger) => `
            <tr>
              <td>${passenger.firstName} ${passenger.lastName}</td>
              <td>Adult</td>
              <td>${passenger.email}</td>
            </tr>
          `,
              )
              .join("")}
          ${bookingData.passengersData?.children
              ?.map(
                  (passenger: Passenger) => `
            <tr>
              <td>${passenger.firstName} ${passenger.lastName}</td>
              <td>Child</td>
              <td>${passenger.email || "-"}</td>
            </tr>
          `,
              )
              .join("")}
          ${bookingData.passengersData?.infants
              ?.map(
                  (passenger: Passenger) => `
            <tr>
              <td>${passenger.firstName} ${passenger.lastName}</td>
              <td>Infant</td>
              <td>${passenger.email || "-"}</td>
            </tr>
          `,
              )
              .join("")}
        </table>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
          <h3>Payment Summary</h3>
          <p>Subtotal: €${(bookingData.totalPrice * 0.9).toFixed(2)}</p>
          <p>Taxes & Fees: €${(bookingData.totalPrice * 0.1).toFixed(2)}</p>
          <p><strong>Total Paid: €${bookingData.totalPrice.toFixed(2)}</strong></p>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing our airline. We wish you a pleasant journey!</p>
          <p>For any questions, please contact our customer service.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const sendTicketByEmail = async (bookingData: BookingData, bookingReference: string): Promise<void> => {
    try {
        const emailContent = generateEmailContent(bookingData, bookingReference);
        const recipientEmail = bookingData.passengersData.adults[0].email;

        const response = await fetch("http://localhost:3011/api/send-ticket", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                to: recipientEmail,
                subject: `Your Flight Booking Confirmation - ${bookingReference}`,
                html: emailContent,
                bookingReference: bookingReference,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to send email");
        }

        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export default function BookingConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingData = location.state?.bookingData as BookingData;
    const paymentMethod = location.state?.paymentMethod;
    const [currentStep] = useState(3);

    useEffect(() => {
        if (!bookingData) {
            navigate("/flights");
        }
    }, [bookingData, navigate]);
 

    useEffect(() => {
        if (bookingData.bookingReference) {
      
            sendTicketByEmail(bookingData, bookingData.bookingReference);
        }
    }, [bookingData]);

    if (!bookingData) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500">No booking data found</p>
                    <button
                        onClick={() => navigate("/flights")}
                        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
                    >
                        Return to Flights
                    </button>
                </div>
            </div>
        );
    }

    const bookingReference = bookingData.bookingReference;

    return (
        <div className="relative z-10 mt-[-100px] w-full rounded bg-white p-6 shadow-lg">
            <Stepper currentStep={currentStep} />
            <div className="w-full">
                <div className="overflow-hidden">
                    <div className="bg-green-50 px-6 py-8 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <h1 className="mt-4 text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
                        <p className="mt-2 text-gray-600">Your flight has been successfully booked. Below are your booking details.</p>
                        <div className="mt-6 rounded-md bg-white p-4 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">Booking Reference</p>
                            <p className="mt-1 text-xl font-bold text-gray-900">{bookingReference}</p>
                            <p className="mt-2 text-sm text-gray-500">
                                Payment Method:{" "}
                                <span className="font-medium capitalize">{paymentMethod === "paypal" ? "PayPal" : "Credit/Debit Card"}</span>
                            </p>
                        </div>
                    </div>

                    <div className="px-6 py-8">
                        <div className="grid gap-8 md:grid-cols-2">
                            <div className="rounded-lg border border-gray-200 p-6">
                                <h2 className="mb-4 text-xl font-bold text-gray-800">Outbound Flight</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 pt-1">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                                <svg
                                                    className="h-6 w-6 text-blue-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M8 7l4-4m0 0l4 4m-4-4v18"
                                                    ></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {bookingData.fromCity} ({bookingData.from}) to {bookingData.toCity} ({bookingData.to})
                                            </h3>
                                            <p className="text-gray-500">
                                                {new Date(bookingData.outbound.date).toLocaleDateString("en-US", {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                            <div className="mt-2 grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Departure</p>
                                                    <p className="font-medium">{bookingData.outbound.departure_time}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Arrival</p>
                                                    <p className="font-medium">{bookingData.outbound.arrival_time}</p>
                                                </div>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">Flight number: {bookingData.outbound.noflight}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {bookingData.return && (
                                <div className="rounded-lg border border-gray-200 p-6">
                                    <h2 className="mb-4 text-xl font-bold text-gray-800">Return Flight</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 pt-1">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                                    <svg
                                                        className="h-6 w-6 text-blue-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M16 17l-4 4m0 0l-4-4m4 4V3"
                                                        ></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {bookingData.toCity} ({bookingData.to}) to {bookingData.fromCity} ({bookingData.from})
                                                </h3>
                                                <p className="text-gray-500">
                                                    {new Date(bookingData.return.date).toLocaleDateString("en-US", {
                                                        weekday: "long",
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </p>
                                                <div className="mt-2 grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Departure</p>
                                                        <p className="font-medium">{bookingData.return.departure_time}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Arrival</p>
                                                        <p className="font-medium">{bookingData.return.arrival_time}</p>
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-sm text-gray-500">Flight number: {bookingData.return.noflight}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 rounded-lg border border-gray-200 p-6">
                            <h2 className="mb-4 text-xl font-bold text-gray-800">Passenger Details</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Phone</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {bookingData.passengersData?.adults?.map((passenger: Passenger, index: number) => (
                                            <tr key={`adult-${index}`}>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    {passenger.firstName} {passenger.lastName}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">Adult</td>
                                                <td className="whitespace-nowrap px-6 py-4">{passenger.email}</td>
                                                <td className="whitespace-nowrap px-6 py-4">{passenger.phone}</td>
                                            </tr>
                                        ))}
                                        {bookingData.passengersData?.children?.map((passenger: Passenger, index: number) => (
                                            <tr key={`child-${index}`}>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    {passenger.firstName} {passenger.lastName}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">Child</td>
                                                <td className="whitespace-nowrap px-6 py-4">{passenger.email || "-"}</td>
                                                <td className="whitespace-nowrap px-6 py-4">{passenger.phone || "-"}</td>
                                            </tr>
                                        ))}
                                        {bookingData.passengersData?.infants?.map((passenger: Passenger, index: number) => (
                                            <tr key={`infant-${index}`}>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    {passenger.firstName} {passenger.lastName}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">Infant</td>
                                                <td className="whitespace-nowrap px-6 py-4">{passenger.email || "-"}</td>
                                                <td className="whitespace-nowrap px-6 py-4">{passenger.phone || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-8 rounded-lg border border-gray-200 p-6">
                            <h2 className="mb-4 text-xl font-bold text-gray-800">Payment Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">€{(bookingData.totalPrice * 0.9).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Taxes & Fees</span>
                                    <span className="font-medium">€{(bookingData.totalPrice * 0.1).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-4">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-lg font-bold text-gray-900">€{bookingData.totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="pt-2 text-right text-sm text-gray-500">
                                    Paid with {paymentMethod === "paypal" ? "PayPal" : "Credit Card"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 bg-gray-50 px-6 py-5">
                        <div className="flex justify-between">
                            <button
                                onClick={() => navigate("/")}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Book Another Flight
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="ml-3 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Print Confirmation
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
