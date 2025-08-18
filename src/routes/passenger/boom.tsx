import { useState, useCallback, memo } from "react";
import { ChevronLeft, MapPin } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { COUNTRIES } from "../../constants/country";

interface Flight {
    id: number;
    flightId: number; // Ajouté pour cohérence
    from: string;
    to: string;
    date: string;
    departure_time: string;
    arrival_time: string;
    price: number;
    noflight: string;
    type: "plane" | "helicopter"; // Propriété manquante ajoutée
    typev: "onway" | "roundtrip"; // Propriété manquante ajoutée
}

interface PassengerFormData {
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    title: string;
    nationality: string;
    country: string;
    phone: string;
    email: string;
    address: string;
    middle: string;
}

interface PassengerData {
    outbound: Flight;
    return?: Flight;
    passengers: {
        adults: number;
        children: number;
        infants: number;
    };
    tripType: string;
    tabType: string;
    from: string;
    to: string;
    fromCity: string;
    toCity: string;
    departureDate: string;
    returnDate?: string;
    totalPrice: number;
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

interface PassengerFormProps {
    type: "adults" | "children" | "infants";
    index: number;
    passenger: PassengerFormData;
    isChild?: boolean;
    isInfant?: boolean;
    onChange: (type: "adults" | "children" | "infants", index: number, field: keyof PassengerFormData, value: string) => void;
}

const PassengerForm = memo(({ type, index, passenger, isChild = false, isInfant = false, onChange }: PassengerFormProps) => {
    return (
        <div className="mb-8 rounded-lg border p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold">
                {isInfant ? `Infant ${index + 1}` : isChild ? `Child ${index + 1}` : `Adult Passenger ${index + 1}`}
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block font-medium text-gray-600">First Name *</label>
                    <div className="flex items-center rounded-full border p-2">
                        <input
                            type="text"
                            value={passenger.firstName}
                            placeholder="First Name"
                            onChange={(e) => onChange(type, index, "firstName", e.target.value)}
                            className="input-style w-full bg-transparent outline-none"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="mb-1 block font-medium text-gray-600">Middle Name</label>
                    <div className="flex items-center rounded-full border p-2">
                        <input
                            type="text"
                            value={passenger.middle}
                            placeholder="Middle Name"
                            onChange={(e) => onChange(type, index, "middle", e.target.value)}
                            className="input-style w-full bg-transparent outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1 block font-medium text-gray-600">Last Name *</label>
                    <div className="flex items-center rounded-full border p-2">
                        <input
                            type="text"
                            value={passenger.lastName}
                            placeholder="Last Name"
                            onChange={(e) => onChange(type, index, "lastName", e.target.value)}
                            className="input-style w-full bg-transparent outline-none"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1 block font-medium text-gray-600">Date of Birth *</label>
                    <div className="flex items-center rounded-full border p-2">
                        <input
                            type="date"
                            value={passenger.dob}
                            onChange={(e) => onChange(type, index, "dob", e.target.value)}
                            className="input-style w-full bg-transparent outline-none"
                            required
                        />
                    </div>
                </div>

                {!isInfant && (
                    <div>
                        <label className="mb-1 block font-medium text-gray-600">Gender *</label>
                        <div className="flex items-center rounded-full border p-2">
                            <select
                                value={passenger.gender}
                                onChange={(e) => onChange(type, index, "gender", e.target.value)}
                                className="input-style w-full bg-transparent outline-none"
                                required
                            >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                )}

                {!isChild && !isInfant && (
                    <>
                        <div>
                            <label className="mb-1 block font-medium text-gray-600">Title *</label>
                            <div className="flex items-center rounded-full border p-2">
                                <select
                                    value={passenger.title}
                                    onChange={(e) => onChange(type, index, "title", e.target.value)}
                                    className="input-style w-full bg-transparent outline-none"
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="mr">Mr</option>
                                    <option value="mrs">Mrs</option>
                                    <option value="ms">Ms</option>
                                    <option value="dr">Dr</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block font-medium text-gray-600">Address *</label>
                            <div className="flex items-center rounded-full border p-2">
                                <input
                                    type="text"
                                    placeholder="Address"
                                    value={passenger.address}
                                    onChange={(e) => onChange(type, index, "address", e.target.value)}
                                    className="input-style w-full bg-transparent outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block font-medium text-gray-600">Country / Region of Residence *</label>
                            <div className="flex items-center rounded-full border p-2">
                                <select
                                    value={passenger.country}
                                    onChange={(e) => onChange(type, index, "country", e.target.value)}
                                    className="input-style w-full bg-transparent outline-none"
                                    required
                                >
                                    <option value="">Select</option>
                                    {COUNTRIES.map((country) => (
                                        <option
                                            key={country.code}
                                            value={country.code}
                                        >
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block font-medium text-gray-600">Nationality *</label>
                            <div className="flex items-center rounded-full border p-2">
                                <input
                                    type="text"
                                    value={passenger.nationality}
                                    placeholder="Nationality"
                                    onChange={(e) => onChange(type, index, "nationality", e.target.value)}
                                    className="input-style w-full bg-transparent outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block font-medium text-gray-600">Phone Number *</label>
                            <div className="flex items-center rounded-full border p-2">
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={passenger.phone}
                                    onChange={(e) => onChange(type, index, "phone", e.target.value)}
                                    className="input-style w-full bg-transparent outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block font-medium text-gray-600">Email Address*</label>
                            <div className="flex items-center rounded-full border p-2">
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={passenger.email}
                                    onChange={(e) => onChange(type, index, "email", e.target.value)}
                                    className="input-style w-full bg-transparent outline-none"
                                    required
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
});

const BookingSummary = ({ bookingData }: { bookingData: PassengerData }) => {
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    return (
        <div className="rounded-xl border border-blue-500 bg-white p-4 shadow-lg">
            <div className="mx-auto w-fit rounded-full border border-blue-500 bg-white px-4 py-1 text-sm font-bold text-red-600">
                {bookingData.tripType === "roundtrip" ? "Round Trip" : "One Way"}
            </div>

            <div className="relative mt-4 flex flex-col items-start pl-6">
                <div className="absolute bottom-3 left-0 top-3 z-0 h-[60px] w-0.5 bg-red-600"></div>
                <div className="z-10 mb-6 flex items-start gap-3">
                    <div className="relative -left-8 z-10 mt-0.5">
                        <div className="h-4 w-4 rounded-full border-2 border-blue-500 bg-red-600"></div>
                    </div>
                    <div className="-ml-7">
                        <p className="font-bold text-black">
                            {bookingData.outbound.departure_time} - {bookingData.fromCity} ({bookingData.from})
                        </p>
                        <p className="mt-1 text-[11px] text-black">Flight #{bookingData.outbound.noflight}</p>
                    </div>
                </div>

                <div className="z-10 flex items-start gap-3">
                    <div className="-ml-9 text-lg leading-none text-red-600">
                        <MapPin />
                    </div>
                    <p className="font-bold text-black">
                        {bookingData.outbound.arrival_time} - {bookingData.toCity} ({bookingData.to})
                    </p>
                </div>
            </div>

            {bookingData.return && (
                <div className="relative mt-6 flex flex-col items-start pl-6">
                    <div className="absolute bottom-3 left-0 top-3 z-0 h-[79px] w-0.5 bg-red-600"></div>
                    <div className="z-10 mb-6 flex items-start gap-3">
                        <div className="relative -left-8 z-10 mt-0.5">
                            <div className="h-4 w-4 rounded-full border-2 border-blue-500 bg-red-600"></div>
                        </div>
                        <div className="-ml-7">
                            <p className="font-bold text-black">
                                {bookingData.return.departure_time} - {bookingData.toCity} ({bookingData.to})
                            </p>
                            <p className="mt-1 text-[11px] text-black">Flight #{bookingData.return.noflight}</p>
                        </div>
                    </div>

                    <div className="z-10 flex items-start gap-3">
                        <div className="-ml-9 text-lg leading-none text-red-600">
                            <MapPin />
                        </div>
                        <p className="font-bold text-black">
                            {bookingData.return.arrival_time} - {bookingData.fromCity} ({bookingData.from})
                        </p>
                    </div>
                </div>
            )}

            <div className="mt-4">
                <p className="mb-2 text-base font-bold text-red-600">Booking Details</p>
                <div className="grid grid-cols-2 gap-y-1 text-[13px] font-semibold text-black">
                    <p>Departure</p>
                    <p className="text-right">{formatDate(bookingData.departureDate)}</p>
                    {bookingData.returnDate && (
                        <>
                            <p>Return</p>
                            <p className="text-right">{formatDate(bookingData.returnDate)}</p>
                        </>
                    )}
                    <p>Adults</p>
                    <p className="text-right">{bookingData.passengers.adults}</p>
                    <p>Children</p>
                    <p className="text-right">{bookingData.passengers.children}</p>
                    <p>Infants</p>
                    <p className="text-right">{bookingData.passengers.infants}</p>
                </div>
            </div>

            <div className="mt-4 text-center text-2xl font-extrabold text-red-600">${bookingData.totalPrice}</div>
        </div>
    );
};

const FlightSummaryCard = ({ bookingData }: { bookingData: PassengerData }) => {
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    return (
        <div className="mx-10 mb-10 flex items-center justify-between rounded-md bg-yellow-400 p-4 text-black shadow-sm">
            <div className="space-y-1">
                <p className="font-semibold">
                    {bookingData.fromCity} ({bookingData.from}) → {bookingData.toCity} ({bookingData.to})
                </p>
                <div className="flex flex-wrap gap-2 text-sm">
                    <span>{formatDate(bookingData.departureDate)}</span>
                    {bookingData.returnDate && (
                        <>
                            <span>|</span>
                            <span>{formatDate(bookingData.returnDate)}</span>
                        </>
                    )}
                    <span>|</span>
                    <span>
                        {bookingData.passengers.adults} Adult{bookingData.passengers.adults > 1 ? "s" : ""}
                        {bookingData.passengers.children > 0 && (
                            <>
                                , {bookingData.passengers.children} Child{bookingData.passengers.children > 1 ? "ren" : ""}
                            </>
                        )}
                        {bookingData.passengers.infants > 0 && (
                            <>
                                , {bookingData.passengers.infants} Infant{bookingData.passengers.infants > 1 ? "s" : ""}
                            </>
                        )}
                    </span>
                    <span>|</span>
                    <span>{bookingData.tripType === "roundtrip" ? "Round Trip" : "One Way"}</span>
                    <span>|</span>
                    <span>{bookingData.tabType === "helicopter" ? "Helicopter" : "Plane"}</span>
                </div>
            </div>
            <div className="text-right">
                <p className="text-xs font-semibold uppercase text-gray-700">Total Price</p>
                <div className="flex items-center text-lg font-bold">
                    <span>${bookingData.totalPrice}</span>
                    <span className="ml-1 text-sm font-medium">USD</span>
                </div>
            </div>
        </div>
    );
};

export default function Passenger() {
    const navigate = useNavigate();
    const location = useLocation();
    const bookingData = location.state as PassengerData;
    const [currentStep] = useState(1);

    const [passengersData, setPassengersData] = useState<{
        adults: PassengerFormData[];
        children: PassengerFormData[];
        infants: PassengerFormData[];
    }>(() => {
        const initialAdultData: PassengerFormData = {
            firstName: "",
            lastName: "",
            dob: "",
            middle: "",
            gender: "",
            title: "",
            address: "",
            nationality: "",
            country: "",
            phone: "",
            email: "",
        };

        return {
            adults: Array(bookingData.passengers.adults)
                .fill(0)
                .map(() => ({ ...initialAdultData })),
            children: Array(bookingData.passengers.children)
                .fill(0)
                .map(() => ({
                    firstName: "",
                    lastName: "",
                    dob: "",
                    gender: "",
                    nationality: "",
                })),
            infants: Array(bookingData.passengers.infants)
                .fill(0)
                .map(() => ({
                    firstName: "",
                    lastName: "",
                    dob: "",
                })),
        };
    });

    const handlePassengerChange = useCallback(
        (type: "adults" | "children" | "infants", index: number, field: keyof PassengerFormData, value: string) => {
            setPassengersData((prev) => {
                const updatedPassengers = [...prev[type]];
                updatedPassengers[index] = {
                    ...updatedPassengers[index],
                    [field]: value,
                };
                return {
                    ...prev,
                    [type]: updatedPassengers,
                };
            });
        },
        [],
    );

    const validateAllPassengers = (): boolean => {
        const adultsValid = passengersData.adults.every(
            (adult) =>
                adult.firstName &&
                adult.lastName &&
                adult.dob &&
                adult.gender &&
                adult.title &&
                adult.country &&
                adult.phone &&
                adult.address &&
                adult.email,
        );

        const childrenValid = passengersData.children.every((child) => child.firstName && child.lastName && child.dob && child.gender);
        const infantsValid = passengersData.infants.every((infant) => infant.firstName && infant.lastName && infant.dob);

        return adultsValid && childrenValid && infantsValid;
    };

    if (!bookingData) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-lg">No booking data found. Please start from the flight selection.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#eeeeef] font-sans">
            <div className="relative z-10 mt-[-100px] w-full rounded bg-white p-6 shadow-lg">
                <Stepper currentStep={currentStep} />
                <FlightSummaryCard bookingData={bookingData} />

                <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-3/4 lg:pr-6">
                        <h2 className="mb-6 text-2xl font-bold text-gray-800">Passenger Information</h2>

                        {passengersData.adults.map((adult, index) => (
                            <PassengerForm
                                key={`adult-${index}`}
                                type="adults"
                                index={index}
                                passenger={adult}
                                onChange={handlePassengerChange}
                            />
                        ))}

                        {passengersData.children.map((child, index) => (
                            <PassengerForm
                                key={`child-${index}`}
                                type="children"
                                index={index}
                                passenger={child}
                                isChild
                                onChange={handlePassengerChange}
                            />
                        ))}

                        {passengersData.infants.map((infant, index) => (
                            <PassengerForm
                                key={`infant-${index}`}
                                type="infants"
                                index={index}
                                passenger={infant}
                                isInfant
                                onChange={handlePassengerChange}
                            />
                        ))}
                    </div>

                    <div className="mt-6 w-full lg:mt-0 lg:w-1/4">
                        <BookingSummary bookingData={bookingData} />
                    </div>
                </div>

                <div className="mt-8 flex justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-6 flex w-48 items-center gap-8 rounded-full bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        Back
                    </button>
                    <button
                        onClick={() => {
                            if (validateAllPassengers()) {
                                // Prepare payment data with flight IDs
                                const paymentData = {
                                    ...bookingData,
                                    passengersData,
                                    outbound: {
                                        ...bookingData.outbound,
                                        flightId: bookingData.outbound.id, // Explicit flight ID
                                        type: bookingData.tabType === "helicopter" ? "helicopter" : "plane", // Détermination du type
                                        typev: bookingData.tripType === "roundtrip" ? "roundtrip" : "onway", // Détermination du type
                                    },
                                    return: bookingData.return
                                        ? {
                                              ...bookingData.return,
                                              flightId: bookingData.return.id, // Explicit flight ID if return exists
                                              type: bookingData.tabType === "helicopter" ? "helicopter" : "plane", // Détermination du type
                                              typev: bookingData.tripType === "roundtrip" ? "roundtrip" : "onway", // Détermination du type
                                          }
                                        : undefined,
                                };

                                // Navigate to payment page
                                navigate("/pay", {
                                    state: paymentData,
                                });
                            } else {
                                alert("Please complete all required fields for all passengers");
                            }
                        }}
                        className="mt-6 w-48 rounded-full bg-red-500 py-3 font-semibold text-white hover:bg-red-600"
                    >
                        Continue to Payment
                    </button>
                </div>
            </div>
        </div>
    );
}
