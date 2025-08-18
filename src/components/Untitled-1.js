"use client";
import { UserIcon, PlaneIcon, CalendarIcon, MapPinIcon, ChevronDown } from "lucide-react";
import { HelicopterIcon } from "./icons/HelicopterIcon";
import { useEffect, useRef, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const BookingForm = () => {
    const [selectedTab, setSelectedTab] = useState("flight");
    const [selectedTabTrip, setSelectedTabTrip] = useState("onway");
    const [passengerDropdownOpen, setPassengerDropdownOpen] = useState(false);
    const [passengers, setPassengers] = useState({ adult: 1, child: 0, infant: 0 });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        let errors: { [key: string]: string } = {};
        if (selectedTab === "flight") {
            const totalTravelers = passengers.adult + passengers.child + passengers.infant;
            if (totalTravelers < 1) errors.travelers = "At least one traveler is required";
            const from = (document.getElementById("from") as HTMLSelectElement)?.value;
            const to = (document.getElementById("to") as HTMLSelectElement)?.value;
            const date = (document.getElementById("date") as HTMLInputElement)?.value;

            const from2 = (document.getElementById("from2") as HTMLSelectElement)?.value;
            const to2 = (document.getElementById("to2") as HTMLSelectElement)?.value;
            const date2 = (document.getElementById("date2") as HTMLInputElement)?.value;
            const dateReturn = (document.getElementById("dateReturn ") as HTMLInputElement)?.value;

            if (selectedTabTrip === "onway") {
                if (!from) errors.from = "Please select departure location";
                if (!to) errors.to = "Please select destination";
                if (from && to && from === to) errors.to = "Departure and destination can't be the same";
                if (!date) errors.date = "Please select a date";
            } else {
                if (!from2) errors.from2 = "Please select departure location";
                if (!to2) errors.to2 = "Please select destination";
                if (from2 && to2 && from === to2) errors.to2 = "Departure and destination can't be the same";
                if (!date2) errors.date2 = "Please select a date";
                if (!dateReturn) errors.dateReturn = "Please select a date return";
            }
        }

        if (selectedTab === "helicopter") {
            const pickup = (document.getElementById("pickup") as HTMLInputElement)?.value;
            const dropoff = (document.getElementById("dropoff") as HTMLInputElement)?.value;
            const date = (document.getElementById("helicopterDate") as HTMLInputElement)?.value;
            const time = (document.getElementById("helicopterTime") as HTMLInputElement)?.value;

            if (!pickup) errors.pickup = "Pickup location required";
            if (!dropoff) errors.dropoff = "Drop-off location required";
            if (pickup && dropoff && pickup === dropoff) errors.dropoff = "Pickup and drop-off can't be the same";
            if (!date) errors.helicopterDate = "Date required";
            if (!time) errors.helicopterTime = "Time required";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Form is valid, submitting...");
        } else {
            console.warn("Form validation failed", formErrors);
        }
    };

    const updatePassenger = (type: string, delta: number) => {
        setPassengers((prev) => {
            const newValue = Math.max(0, prev[type as keyof typeof prev] + delta);
            if (type === "adult" && newValue < 1) return prev;
            return { ...prev, [type]: newValue };
        });
    };

    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setPassengerDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative -mt-32 mb-10 px-4 md:px-10">
            <div className="relative mx-auto max-w-6xl rounded-bl-3xl rounded-br-3xl rounded-tr-3xl bg-blue-400 bg-opacity-40 p-4 shadow-xl">
                {/* Tabs: Flight / Helicopter */}
                <div className="absolute left-0 top-[-40px] z-[40] flex w-fit space-x-2 bg-blue-400 bg-opacity-40 shadow-md">
                    <button
                        onClick={() => setSelectedTab("flight")}
                        className={`flex cursor-pointer items-center px-4 py-2 font-medium text-white hover:cursor-pointer focus:outline-none ${selectedTab === "flight" ? "bg-red-600 bg-opacity-70" : ""}`}
                        type="button"
                    >
                        <PlaneIcon className="mr-2 h-4 w-4" /> Flight
                    </button>
                    <button
                        onClick={() => setSelectedTab("helicopter")}
                        className={`flex cursor-pointer items-center px-4 py-2 font-medium text-white hover:cursor-pointer focus:outline-none ${selectedTab === "helicopter" ? "bg-red-600 bg-opacity-70" : ""}`}
                        type="button"
                    >
                        <HelicopterIcon className="mr-2 h-4 w-4" /> Helicopter
                    </button>
                </div>

                {/* Form Container */}
                <div className="rounded-2xl bg-white p-6 shadow-xl md:p-10">
                    {selectedTab === "flight" ? (
                        <>
                            <form
                                className="relative"
                                onSubmit={handleSubmit}
                            >
                                <div className="sm:md-6 absolute z-[40] flex flex-wrap items-center justify-between gap-4">
                                    <div className="mt-[-250px] flex w-fit space-x-2 rounded-full bg-gray-200 p-1 md:mt-[-130px]">
                                        <button
                                            onClick={() => setSelectedTabTrip("onway")}
                                            className={`flex cursor-pointer items-center rounded-full px-4 py-2 font-medium ${selectedTabTrip === "onway" ? "bg-white font-extrabold text-blue-500" : ""}`}
                                            type="button"
                                        >
                                            One way
                                        </button>
                                        <button
                                            onClick={() => setSelectedTabTrip("roundtrip")}
                                            className={`flex cursor-pointer items-center rounded-full px-4 py-2 font-medium ${selectedTabTrip === "roundtrip" ? "bg-white font-extrabold text-blue-500" : ""}`}
                                            type="button"
                                        >
                                            Round Trip
                                        </button>
                                    </div>
                                    <div className="mt-[-150px] flex cursor-pointer items-center rounded-full bg-gray-200 px-4 py-2 font-bold text-blue-800 md:mt-[-130px]">
                                        {/* Traveler Dropdown */}
                                        <div
                                            className="relative"
                                            ref={dropdownRef}
                                        >
                                            <div
                                                className="flex cursor-pointer items-center py-2"
                                                onClick={() => setPassengerDropdownOpen(!passengerDropdownOpen)}
                                            >
                                                <UserIcon className="mr-2 h-4 w-4 text-blue-500" />
                                                <span className="text-sm text-blue-500">
                                                    {passengers.adult + passengers.child + passengers.infant} Traveler
                                                    {passengers.adult + passengers.child + passengers.infant > 1 ? "s" : ""}
                                                </span>
                                                <ChevronDown className="ml-2 h-4 w-4 text-blue-500" />
                                            </div>
                                            {passengerDropdownOpen && (
                                                <div className="absolute z-50 mt-2 w-64 rounded-lg bg-white p-4 shadow-lg">
                                                    {["adult", "child", "infant"].map((type) => (
                                                        <div
                                                            key={type}
                                                            className="mb-3 flex items-center justify-between"
                                                        >
                                                            <div>
                                                                <div className="font-medium capitalize">
                                                                    {type} {type === "adult" ? "(12+)" : type === "child" ? "(2-12)" : "(0-2)"}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {type === "adult" ? "Required" : "Optional"}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    className="rounded bg-gray-200 px-2 py-1 text-lg"
                                                                    onClick={() => updatePassenger(type, -1)}
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="w-4 text-center">{passengers[type as keyof typeof passengers]}</span>
                                                                <button
                                                                    className="rounded bg-gray-200 px-2 py-1 text-lg"
                                                                    onClick={() => updatePassenger(type, 1)}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {selectedTabTrip === "onway" ? (
                                    <div className="mb-6 mt-40 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-20 md:grid-cols-3">
                                        <div>
                                            <label className="mb-1 block font-medium text-gray-600">From</label>
                                            <div className="flex items-center rounded-full border p-2">
                                                <MapPinIcon className="mr-2 h-4 w-4 text-red-500" />
                                                <select
                                                    id="from"
                                                    className="w-full bg-transparent outline-none"
                                                    defaultValue=""
                                                >
                                                    <option
                                                        value=""
                                                        disabled
                                                    >
                                                        Select Departure
                                                    </option>
                                                    <option value="pap">Port-au-Prince (PAP)</option>
                                                    <option value="cap">Cap-Haïtien (CAP)</option>
                                                    <option value="mia">Miami (MIA)</option>
                                                </select>
                                            </div>
                                            {formErrors.from && <p className="text-sm text-red-600">{formErrors.from}</p>}
                                        </div>
                                        <div>
                                            <label className="mb-1 block font-medium text-gray-600">To</label>
                                            <div className="flex items-center rounded-full border p-2">
                                                <MapPinIcon className="mr-2 h-4 w-4 text-red-500" />
                                                <select
                                                    id="to"
                                                    className="w-full bg-transparent outline-none"
                                                    defaultValue=""
                                                >
                                                    <option
                                                        value=""
                                                        disabled
                                                    >
                                                        Select Destination
                                                    </option>
                                                    <option value="pap">Port-au-Prince (PAP)</option>
                                                    <option value="cap">Cap-Haïtien (CAP)</option>
                                                    <option value="mia">Miami (MIA)</option>
                                                </select>
                                            </div>
                                            {formErrors.to && <p className="text-sm text-red-600">{formErrors.to}</p>}
                                        </div>
                                        <div className="relative">
                                            <label className="mb-1 block font-medium text-gray-600">Date Range</label>
                                            <div className="flex items-center rounded-full border p-2">
                                                <CalendarIcon className="mr-2 h-4 w-4 text-red-500" />
                                                <input
                                                    id="date"
                                                    type="date"
                                                    className="w-full bg-transparent outline-none"
                                                />
                                            </div>
                                            {formErrors.date && <p className="text-sm text-red-600">{formErrors.date}</p>}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-6 mt-40 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-20 md:grid-cols-3">
                                        <div>
                                            <label className="mb-1 block font-medium text-gray-600">From</label>
                                            <div className="flex items-center rounded-full border p-2">
                                                <MapPinIcon className="mr-2 h-4 w-4 text-red-500" />
                                                <select
                                                    id="from2"
                                                    className="w-full bg-transparent outline-none"
                                                    defaultValue=""
                                                >
                                                    <option
                                                        value=""
                                                        disabled
                                                    >
                                                        Select Departure
                                                    </option>
                                                    <option value="pap">Port-au-Prince (PAP)</option>
                                                    <option value="cap">Cap-Haïtien (CAP)</option>
                                                    <option value="mia">Miami (MIA)</option>
                                                </select>
                                            </div>
                                            {formErrors.from2 && <p className="text-sm text-red-600">{formErrors.from2}</p>}
                                        </div>
                                        <div>
                                            <label className="mb-1 block font-medium text-gray-600">To</label>
                                            <div className="flex items-center rounded-full border p-2">
                                                <MapPinIcon className="mr-2 h-4 w-4 text-red-500" />
                                                <select
                                                    id="to2"
                                                    className="w-full bg-transparent outline-none"
                                                    defaultValue=""
                                                >
                                                    <option
                                                        value=""
                                                        disabled
                                                    >
                                                        Select Destination
                                                    </option>
                                                    <option value="pap">Port-au-Prince (PAP)</option>
                                                    <option value="cap">Cap-Haïtien (CAP)</option>
                                                    <option value="mia">Miami (MIA)</option>
                                                </select>
                                            </div>
                                            {formErrors.to2 && <p className="text-sm text-red-600">{formErrors.to2}</p>}
                                        </div>
                                        <div>
                                            <label className="mb-1 block font-medium text-gray-600">Depart</label>
                                            <div className="flex items-center rounded-full border p-2">
                                                <CalendarIcon className="mr-2 h-4 w-4 text-red-500" />
                                                <input
                                                    id="date2"
                                                    type="date"
                                                    className="w-full bg-transparent outline-none"
                                                />
                                            </div>
                                            {formErrors.date2 && <p className="text-sm text-red-600">{formErrors.date2}</p>}
                                        </div>
                                        <div>
                                            <label className="mb-1 block font-medium text-gray-600">Return</label>
                                            <div className="flex items-center rounded-full border p-2">
                                                <CalendarIcon className="mr-2 h-4 w-4 text-red-500" />
                                                <input
                                                    id="dateReturn"
                                                    type="date"
                                                    className="w-full bg-transparent outline-none"
                                                />
                                            </div>
                                            {formErrors.dateReturn && <p className="text-sm text-red-600">{formErrors.dateReturn}</p>}
                                        </div>
                                    </div>
                                )}

                                <div className="text-right">
                                    <button
                                        type="submit"
                                        className="w-full rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 sm:w-auto"
                                    >
                                        Search Flights
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center text-gray-700">
                            <h3 className="mb-4 text-xl font-bold">Helicopter Booking</h3>
                            <p className="mb-4">Please fill in the helicopter trip details.</p>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <input
                                    type="text"
                                    placeholder="Pickup Location"
                                    className="w-full rounded-lg border px-4 py-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Drop-off Location"
                                    className="w-full rounded-lg border px-4 py-2"
                                />
                                <input
                                    type="date"
                                    className="w-full rounded-lg border px-4 py-2"
                                />
                                <input
                                    type="time"
                                    className="w-full rounded-lg border px-4 py-2"
                                />
                            </div>
                            <div className="mt-6 text-right">
                                <button className="w-full rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 sm:w-auto">
                                    Search Helicopter
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingForm;
