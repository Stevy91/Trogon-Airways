import { useState } from "react";
import { ChevronLeft, MapPin } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

// Types
interface Flight {
    id: number;
    from: string;
    to: string;
    date: string;
    departure_time: string;
    arrival_time: string;
    price: number;
    type: "plane" | "helicopter";
    noflight: string;
}

interface PassengerFormData {
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    title: string;
    nationality: string;
    passport?: string;
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
                        <div key={idx} className="flex w-1/4 flex-col items-center text-center text-sm">
                            <div className={`relative z-10 mb-2 h-4 w-4 rounded-full border-2 ${
                                isActive ? "border-blue-500 bg-red-500" :
                                isCompleted ? "border-blue-500 bg-blue-500" :
                                "border-blue-500 bg-slate-50"
                            }`}>
                                {isCompleted && (
                                    <svg className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform text-white"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className={`whitespace-nowrap ${
                                isActive ? "font-bold text-blue-500" : 
                                isCompleted ? "text-blue-500" : "text-blue-500"
                            }`}>
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default function Passenger() {
    const navigate = useNavigate();
    const location = useLocation();
    const bookingData = location.state as PassengerData;
    const [currentStep] = useState(1);
    
    // État pour stocker les données de tous les passagers
    const [passengersData, setPassengersData] = useState<{
        adults: PassengerFormData[];
        children: PassengerFormData[];
        infants: PassengerFormData[];
    }>({
        adults: Array(bookingData.passengers.adults).fill({
            firstName: "",
            lastName: "",
            dob: "",
            gender: "",
            title: "",
            nationality: ""
        }),
        children: Array(bookingData.passengers.children).fill({
            firstName: "",
            lastName: "",
            dob: "",
            gender: "",
            nationality: ""
        }),
        infants: Array(bookingData.passengers.infants).fill({
            firstName: "",
            lastName: "",
            dob: ""
        })
    });

    if (!bookingData) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-lg">No booking data found. Please start from the flight selection.</p>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    const handlePassengerChange = (
        type: 'adults' | 'children' | 'infants',
        index: number,
        field: keyof PassengerFormData,
        value: string
    ) => {
        setPassengersData(prev => {
            const updatedPassengers = [...prev[type]];
            updatedPassengers[index] = {
                ...updatedPassengers[index],
                [field]: value
            };
            return {
                ...prev,
                [type]: updatedPassengers
            };
        });
    };

    const validateAllPassengers = (): boolean => {
        // Valider tous les adultes
        const adultsValid = passengersData.adults.every(adult => 
            adult.firstName && adult.lastName && adult.dob && adult.gender && adult.title
        );
        
        // Valider tous les enfants
        const childrenValid = passengersData.children.every(child => 
            child.firstName && child.lastName && child.dob && child.gender
        );
        
        // Valider tous les bébés
        const infantsValid = passengersData.infants.every(infant => 
            infant.firstName && infant.lastName && infant.dob
        );
        
        return adultsValid && childrenValid && infantsValid;
    };

    const FlightSummaryCard = () => (
        <div className="mb-10 mx-10 flex items-center justify-between rounded-md bg-yellow-400 p-4 text-black shadow-sm">
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
                            <>, {bookingData.passengers.children} Child{bookingData.passengers.children > 1 ? "ren" : ""}</>
                        )}
                        {bookingData.passengers.infants > 0 && (
                            <>, {bookingData.passengers.infants} Infant{bookingData.passengers.infants > 1 ? "s" : ""}</>
                        )}
                    </span>
                    <span>|</span>
                    <span>{bookingData.tripType}</span>
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

    const PassengerForm = ({
        type,
        index,
        passenger,
        isChild = false,
        isInfant = false
    }: {
        type: 'adults' | 'children' | 'infants';
        index: number;
        passenger: PassengerFormData;
        isChild?: boolean;
        isInfant?: boolean;
    }) => (
        <div className="mb-8 rounded-lg border p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold">
                {isInfant ? `Infant ${index + 1}` : 
                 isChild ? `Child ${index + 1}` : `Adult Passenger ${index + 1}`}
            </h3>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block font-medium text-gray-600">First Name *</label>
                    <input
                        type="text"
                        value={passenger.firstName}
                        onChange={(e) => handlePassengerChange(type, index, 'firstName', e.target.value)}
                        className="w-full rounded border p-2"
                        required
                    />
                </div>
                
                <div>
                    <label className="mb-1 block font-medium text-gray-600">Last Name *</label>
                    <input
                        type="text"
                        value={passenger.lastName}
                        onChange={(e) => handlePassengerChange(type, index, 'lastName', e.target.value)}
                        className="w-full rounded border p-2"
                        required
                    />
                </div>
                
                <div>
                    <label className="mb-1 block font-medium text-gray-600">Date of Birth *</label>
                    <input
                        type="date"
                        value={passenger.dob}
                        onChange={(e) => handlePassengerChange(type, index, 'dob', e.target.value)}
                        className="w-full rounded border p-2"
                        required
                    />
                </div>
                
                {!isInfant && (
                    <div>
                        <label className="mb-1 block font-medium text-gray-600">Gender *</label>
                        <select
                            value={passenger.gender}
                            onChange={(e) => handlePassengerChange(type, index, 'gender', e.target.value)}
                            className="w-full rounded border p-2"
                            required
                        >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                )}
                
                {!isChild && !isInfant && (
                    <>
                        <div>
                            <label className="mb-1 block font-medium text-gray-600">Title *</label>
                            <select
                                value={passenger.title}
                                onChange={(e) => handlePassengerChange(type, index, 'title', e.target.value)}
                                className="w-full rounded border p-2"
                                required
                            >
                                <option value="">Select</option>
                                <option value="mr">Mr</option>
                                <option value="mrs">Mrs</option>
                                <option value="ms">Ms</option>
                                <option value="dr">Dr</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="mb-1 block font-medium text-gray-600">Nationality *</label>
                            <input
                                type="text"
                                value={passenger.nationality}
                                onChange={(e) => handlePassengerChange(type, index, 'nationality', e.target.value)}
                                className="w-full rounded border p-2"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="mb-1 block font-medium text-gray-600">Passport Number</label>
                            <input
                                type="text"
                                value={passenger.passport || ""}
                                onChange={(e) => handlePassengerChange(type, index, 'passport', e.target.value)}
                                className="w-full rounded border p-2"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    const BookingSummary = () => (
        <div className="sticky top-4 rounded-xl border border-blue-500 bg-white p-4 shadow-lg">
            <div className="mx-auto w-fit rounded-full border border-blue-500 bg-white px-4 py-1 text-sm font-bold text-red-600">
                {bookingData.tripType === "roundtrip" ? "Round Trip" : "One Way"}
            </div>

            <div className="mt-4">
                <p className="mb-2 text-base font-bold text-red-600">Flight Details</p>
                <div className="space-y-4">
                    <div>
                        <p className="font-semibold">Outbound</p>
                        <p className="text-sm">
                            {bookingData.outbound.departure_time} - {formatDate(bookingData.departureDate)}
                        </p>
                        <p className="text-sm">
                            {bookingData.fromCity} ({bookingData.from}) → {bookingData.toCity} ({bookingData.to})
                        </p>
                    </div>
                    
                    {bookingData.return && (
                        <div>
                            <p className="font-semibold">Return</p>
                            <p className="text-sm">
                                {bookingData.return.departure_time} - {formatDate(bookingData.returnDate!)}
                            </p>
                            <p className="text-sm">
                                {bookingData.toCity} ({bookingData.to}) → {bookingData.fromCity} ({bookingData.from})
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4">
                <p className="mb-2 text-base font-bold text-red-600">Passengers</p>
                <div className="grid grid-cols-2 gap-y-1 text-sm">
                    <p>Adults:</p>
                    <p className="text-right">{bookingData.passengers.adults}</p>
                    <p>Children:</p>
                    <p className="text-right">{bookingData.passengers.children}</p>
                    <p>Infants:</p>
                    <p className="text-right">{bookingData.passengers.infants}</p>
                </div>
            </div>

            <div className="mt-4 border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-red-600">${bookingData.totalPrice}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#eeeeef] font-sans">
            <div className="relative flex h-[300px] items-center bg-cover bg-center px-12" style={{ backgroundImage: "url('/plane-bg.jpg')" }}>
                <div className="absolute inset-0 z-10 h-[300px] bg-black bg-opacity-40"></div>
            </div>

            <div className="relative z-10 mx-auto mt-[-100px] max-w-6xl rounded bg-white p-6 shadow-lg">
                <Stepper currentStep={currentStep} />
                <FlightSummaryCard />

                <div className="flex flex-col lg:flex-row">
                    {/* Formulaire principal */}
                    <div className="w-full lg:w-3/4 lg:pr-6">
                        <h2 className="mb-6 text-2xl font-bold text-gray-800">Passenger Information</h2>
                        
                        {/* Adultes */}
                        {passengersData.adults.map((adult, index) => (
                            <PassengerForm 
                                key={`adult-${index}`}
                                type="adults"
                                index={index}
                                passenger={adult}
                            />
                        ))}
                        
                        {/* Enfants */}
                        {passengersData.children.map((child, index) => (
                            <PassengerForm 
                                key={`child-${index}`}
                                type="children"
                                index={index}
                                passenger={child}
                                isChild
                            />
                        ))}
                        
                        {/* Bébés */}
                        {passengersData.infants.map((infant, index) => (
                            <PassengerForm 
                                key={`infant-${index}`}
                                type="infants"
                                index={index}
                                passenger={infant}
                                isInfant
                            />
                        ))}
                    </div>

                    {/* Résumé de réservation */}
                    <div className="mt-6 w-full lg:mt-0 lg:w-1/4">
                        <BookingSummary />
                    </div>
                </div>

                {/* Boutons de navigation */}
                <div className="mt-8 flex justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 rounded-2xl bg-gray-200 px-6 py-2 font-semibold text-gray-800 hover:bg-gray-300"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        Back
                    </button>
                    <button
                        onClick={() => {
                            if (validateAllPassengers()) {
                                navigate("/pay", { 
                                    state: {
                                        ...bookingData,
                                        passengersData
                                    }
                                });
                            } else {
                                alert("Please complete all required fields for all passengers");
                            }
                        }}
                        className="rounded-2xl bg-red-600 px-8 py-3 font-semibold text-white hover:bg-red-700"
                    >
                        Continue to Payment
                    </button>
                </div>
            </div>
        </div>
    );
}