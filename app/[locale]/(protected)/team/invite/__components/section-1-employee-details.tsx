"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Section1EmployeeDetailsData {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  designation: string;
  department: string;
  secondaryDepartment: string;
  role: string;
}

interface Section1EmployeeDetailsProps {
  data?: Section1EmployeeDetailsData;
  onChange?: (data: Section1EmployeeDetailsData) => void;
}

export function Section1EmployeeDetails({
  data,
  onChange,
}: Section1EmployeeDetailsProps) {
  const [firstName, setFirstName] = useState(data?.firstName || "");
  const [lastName, setLastName] = useState(data?.lastName || "");
  const [email, setEmail] = useState(data?.email || "");
  const [mobileNumber, setMobileNumber] = useState(data?.mobileNumber || "");
  const [designation, setDesignation] = useState(data?.designation || "");
  const [department, setDepartment] = useState(data?.department || "Support");
  const [secondaryDepartment, setSecondaryDepartment] = useState(data?.secondaryDepartment || "None");
  const [role, setRole] = useState(data?.role || "Employee");

  const updateParent = (fields: Partial<Section1EmployeeDetailsData>) => {
    if (onChange) {
      onChange({
        firstName,
        lastName,
        email,
        mobileNumber,
        designation,
        department,
        secondaryDepartment,
        role,
        ...fields,
      });
    }
  };

  return (
    <Card className="shadow-sm border border-default-200 h-full">
      <CardContent className="p-6 flex flex-col justify-between h-full space-y-5">
        <div className="space-y-5">
          {/* Header Title */}
          <div className="flex items-center justify-between ">
            <div className="text-xs font-bold text-default-500 uppercase tracking-wider">
              SECTION 1: Employee Details
            </div>
          </div>

          {/* Input Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-xs font-semibold text-default-700">
                First Name *
              </Label>
              <Input
                id="firstName"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  updateParent({ firstName: e.target.value });
                }}
                required
                className="h-10 text-sm"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-xs font-semibold text-default-700">
                Last Name *
              </Label>
              <Input
                id="lastName"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  updateParent({ lastName: e.target.value });
                }}
                required
                className="h-10 text-sm"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-default-700">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="employee@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  updateParent({ email: e.target.value });
                }}
                required
                className="h-10 text-sm"
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <Label htmlFor="mobileNumber" className="text-xs font-semibold text-default-700">
                Mobile Number
              </Label>
              <Input
                id="mobileNumber"
                placeholder="+1 (555) 000-0000"
                value={mobileNumber}
                onChange={(e) => {
                  setMobileNumber(e.target.value);
                  updateParent({ mobileNumber: e.target.value });
                }}
                className="h-10 text-sm"
              />
            </div>

            {/* Designation */}
            <div className="space-y-2">
              <Label htmlFor="designation" className="text-xs font-semibold text-default-700">
                Designation
              </Label>
              <Input
                id="designation"
                placeholder="e.g. Senior Specialist"
                value={designation}
                onChange={(e) => {
                  setDesignation(e.target.value);
                  updateParent({ designation: e.target.value });
                }}
                className="h-10 text-sm"
              />
            </div>

            {/* Primary Department */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-default-700">
                Primary Department *
              </Label>
              <Select
                value={department}
                onValueChange={(val) => {
                  setDepartment(val);
                  updateParent({ department: val });
                }}
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select Primary Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                  <SelectItem value="Billing">Billing</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Secondary Department */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-default-700">
                Secondary Department
              </Label>
              <Select
                value={secondaryDepartment}
                onValueChange={(val) => {
                  setSecondaryDepartment(val);
                  updateParent({ secondaryDepartment: val });
                }}
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select Secondary Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                  <SelectItem value="Billing">Billing</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-default-700">
                Role *
              </Label>
              <Select
                value={role}
                onValueChange={(val) => {
                  setRole(val);
                  updateParent({ role: val });
                }}
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
