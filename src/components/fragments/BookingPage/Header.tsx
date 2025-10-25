"use client"
import {motion} from "framer-motion";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type {Step} from "./types";

interface HeaderProps {
    step: Step;
    setStep: (s: Step) => void;
}

export default function Header({step, setStep}: HeaderProps) {
    return (
        <motion.header
            initial={{opacity: 0, y: -8}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.4}}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
            <div className="gap-4 flex flex-col">
                <h1 className="text-3xl md:text-6xl font-light tracking-tight">
                    OUR SIGNATURE TREATMENTS
                </h1>
                <p className="text-muted-foreground">
                    Indulge in our curated collection of premium salon experiences designed to bring out your natural
                    beauty.
                </p>
            </div>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        {step > 1 ? (
                            <BreadcrumbLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setStep(1);
                                }}
                            >
                                Services
                            </BreadcrumbLink>
                        ) : (
                            <BreadcrumbPage>Services</BreadcrumbPage>
                        )}
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        {step > 2 ? (
                            <BreadcrumbLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setStep(2);
                                }}
                            >
                                Professional
                            </BreadcrumbLink>
                        ) : step === 2 ? (
                            <BreadcrumbPage>Professional</BreadcrumbPage>
                        ) : (
                            <span className="text-muted-foreground">Professional</span>
                        )}
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        {step > 3 ? (
                            <BreadcrumbLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setStep(3);
                                }}
                            >
                                Schedule
                            </BreadcrumbLink>
                        ) : step === 3 ? (
                            <BreadcrumbPage>Schedule</BreadcrumbPage>
                        ) : (
                            <span className="text-muted-foreground">Schedule</span>
                        )}
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        {step === 4 ? (
                            <BreadcrumbPage>Confirm</BreadcrumbPage>
                        ) : (
                            <span className="text-muted-foreground">Confirm</span>
                        )}
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </motion.header>
    );
}
