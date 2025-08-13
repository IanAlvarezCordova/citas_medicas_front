'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmDialog } from 'primereact/confirmdialog';

interface Cita {
    id?: number;
    paciente: any;
    medico: any;
    consultorio: any;
    fecha: Date | null;
    hora: Date | null; // Usamos Date para hora, pero extraemos solo time
}

interface Paciente { id: number; nombre: string; apellido: string; }
interface Medico { id: number; nombre: string; apellido: string; }
interface Consultorio { id: number; numero: string; piso: number; }

const CitasPage = () => {
    const [citas, setCitas] = useState<Cita[]>([]);
    const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [medicos, setMedicos] = useState<Medico[]>([]);
    const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        fetchCitas();
        fetchPacientes();
        fetchMedicos();
        fetchConsultorios();
    }, []);

    const fetchCitas = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/citas`);
        const data = await response.json();
        setCitas(data.map((c: any) => ({
            ...c,
            fecha: new Date(c.fecha),
            hora: new Date(`1970-01-01T${c.hora}`)
        })));
    };

    const fetchPacientes = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pacientes`);
        setPacientes(await response.json());
    };

    const fetchMedicos = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medicos`);
        setMedicos(await response.json());
    };

    const fetchConsultorios = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/consultorios`);
        setConsultorios(await response.json());
    };

    const saveCita = async () => {
        if (!selectedCita) return;
        const url = isNew ? `${process.env.NEXT_PUBLIC_API_URL}/api/citas` : `${process.env.NEXT_PUBLIC_API_URL}/api/citas/${selectedCita.id}`;
        const method = isNew ? 'POST' : 'PUT';
        const body = {
            paciente: { id: selectedCita.paciente?.id },
            medico: { id: selectedCita.medico?.id },
            consultorio: { id: selectedCita.consultorio?.id },
            fecha: selectedCita.fecha?.toISOString().split('T')[0],
            hora: selectedCita.hora?.toISOString().split('T')[1].slice(0, 8)
        };
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (response.ok) {
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: isNew ? 'Cita creada' : 'Cita actualizada' });
            fetchCitas();
            setDialogVisible(false);
        } else {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar' });
        }
    };

    const deleteCita = (id: number) => {
        confirmDialog({
            message: '¿Eliminar esta cita?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/citas/${id}`, { method: 'DELETE' });
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Cita eliminada' });
                fetchCitas();
            }
        });
    };

    const openDialog = (cita?: Cita) => {
        setSelectedCita(cita ? { ...cita } : { paciente: null, medico: null, consultorio: null, fecha: null, hora: null });
        setIsNew(!cita);
        setDialogVisible(true);
    };

    const actionsBody = (rowData: Cita) => (
        <div>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => openDialog(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteCita(rowData.id!)} />
        </div>
    );

    const pacienteBody = (rowData: Cita) => `${rowData.paciente?.nombre} ${rowData.paciente?.apellido}`;
    const medicoBody = (rowData: Cita) => `${rowData.medico?.nombre} ${rowData.medico?.apellido}`;
    const consultorioBody = (rowData: Cita) => `${rowData.consultorio?.numero} - Piso ${rowData.consultorio?.piso}`;
    const fechaBody = (rowData: Cita) => rowData.fecha?.toLocaleDateString();
    const horaBody = (rowData: Cita) => rowData.hora?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const pacienteOption = (option: Paciente) => `${option.nombre} ${option.apellido}`;
    const medicoOption = (option: Medico) => `${option.nombre} ${option.apellido}`;
    const consultorioOption = (option: Consultorio) => `${option.numero} - Piso ${option.piso}`;

    return (
        <div className="card">
            <Toast ref={toast} />
            <ConfirmDialog />
            <h5>Citas</h5>
            <Button label="Nueva" icon="pi pi-plus" className="mb-3" onClick={() => openDialog()} />
            <DataTable value={citas} paginator rows={10} responsiveLayout="scroll">
                <Column field="paciente" header="Paciente" body={pacienteBody} sortable />
                <Column field="medico" header="Médico" body={medicoBody} sortable />
                <Column field="consultorio" header="Consultorio" body={consultorioBody} sortable />
                <Column field="fecha" header="Fecha" body={fechaBody} sortable />
                <Column field="hora" header="Hora" body={horaBody} sortable />
                <Column header="Acciones" body={actionsBody} />
            </DataTable>

            <Dialog visible={dialogVisible} header={isNew ? 'Nueva Cita' : 'Editar Cita'} onHide={() => setDialogVisible(false)}>
                <div className="p-fluid">
                    <div className="field">
                        <label>Paciente</label>
                        <Dropdown value={selectedCita?.paciente} options={pacientes} onChange={(e) => setSelectedCita({ ...selectedCita!, paciente: e.value })} optionLabel="nombre" placeholder="Selecciona" />
                    </div>
                    <div className="field">
                        <label>Médico</label>
                        <Dropdown value={selectedCita?.medico} options={medicos} onChange={(e) => setSelectedCita({ ...selectedCita!, medico: e.value })} optionLabel="nombre" placeholder="Selecciona" />
                    </div>
                    <div className="field">
                        <label>Consultorio</label>
                        <Dropdown value={selectedCita?.consultorio} options={consultorios} onChange={(e) => setSelectedCita({ ...selectedCita!, consultorio: e.value })} optionLabel="numero" placeholder="Selecciona" />
                    </div>
                    <div className="field">
                        <label>Fecha</label>
                        <Calendar value={selectedCita?.fecha ?? null} onChange={(e) => setSelectedCita({ ...selectedCita!, fecha: (e.value as Date) ?? null })} dateFormat="yy-mm-dd" />
                    </div>
                    <div className="field">
                        <label>Hora</label>
                        <Calendar value={selectedCita?.hora ?? null} onChange={(e) => setSelectedCita({ ...selectedCita!, hora: (e.value as Date) ?? null })} timeOnly hourFormat="24" />
                    </div>
                </div>
                <Button label="Guardar" icon="pi pi-check" onClick={saveCita} />
            </Dialog>
        </div>
    );
};

export default CitasPage;