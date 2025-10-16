"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineInformationCircle,
  HiOutlineX,
  HiOutlinePlus,
} from "react-icons/hi";

export default function CustomerActionsMobile() {
  const navigate = useNavigate();
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  return (
    <div className="lg:hidden flex flex-col gap-3">

    </div>
  );
}