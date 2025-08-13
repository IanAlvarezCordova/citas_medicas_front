'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmDialog } from 'primereact/confirmdialog';


interface Paciente {
    id?: number;
    nombre: string;
    apellido: string;
    fechaNacimiento: Date | null;
    email: string;
}

const PacientesPage = () => {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        fetchPacientes();
    }, []);

    const fetchPacientes = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pacientes`);
        const data = await response.json();
        setPacientes(data.map((p: any) => ({ ...p, fechaNacimiento: new Date(p.fechaNacimiento) })));
    };

    const savePaciente = async () => {
        if (!selectedPaciente) return;
        const url = isNew ? `${process.env.NEXT_PUBLIC_API_URL}/api/pacientes` : `${process.env.NEXT_PUBLIC_API_URL}/api/pacientes/${selectedPaciente.id}`;
        const method = isNew ? 'POST' : 'PUT';
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...selectedPaciente,
                fechaNacimiento: selectedPaciente.fechaNacimiento?.toISOString().split('T')[0]
            })
        });
        if (response.ok) {
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: isNew ? 'Paciente creado' : 'Paciente actualizado' });
            fetchPacientes();
            setDialogVisible(false);
        } else {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar' });
        }
    };

    const deletePaciente = (id: number) => {
        confirmDialog({
            message: '¿Eliminar este paciente?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pacientes/${id}`, { method: 'DELETE' });
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Paciente eliminado' });
                fetchPacientes();
            }
        });
    };

    const openDialog = (paciente?: Paciente) => {
        setSelectedPaciente(paciente ? { ...paciente } : { nombre: '', apellido: '', fechaNacimiento: null, email: '' });
        setIsNew(!paciente);
        setDialogVisible(true);
    };

    const actionsBody = (rowData: Paciente) => (
        <div>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => openDialog(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deletePaciente(rowData.id!)} />
        </div>
    );

    const dateBody = (rowData: Paciente) => rowData.fechaNacimiento?.toLocaleDateString();

    return (
        <div className="card">
            <Toast ref={toast} />
            <ConfirmDialog />
            <h5>Pacientes</h5>
            <Button label="Nuevo" icon="pi pi-plus" className="mb-3" onClick={() => openDialog()} />
            <DataTable value={pacientes} paginator rows={10} responsiveLayout="scroll">
                <Column field="nombre" header="Nombre" sortable />
                <Column field="apellido" header="Apellido" sortable />
                <Column field="fechaNacimiento" header="Fecha Nacimiento" body={dateBody} sortable />
                <Column field="email" header="Email" sortable />
                <Column header="Acciones" body={actionsBody} />
            </DataTable>

            <Dialog visible={dialogVisible} header={isNew ? 'Nuevo Paciente' : 'Editar Paciente'} onHide={() => setDialogVisible(false)}>
                <div className="p-fluid">
                    <div className="field">
                        <label>Nombre</label>
                        <InputText value={selectedPaciente?.nombre} onChange={(e) => setSelectedPaciente({ ...selectedPaciente!, nombre: e.target.value })} />
                    </div>
                    <div className="field">
                        <label>Apellido</label>
                        <InputText value={selectedPaciente?.apellido} onChange={(e) => setSelectedPaciente({ ...selectedPaciente!, apellido: e.target.value })} />
                    </div>
                    <div className="field">
                        <label>Fecha Nacimiento</label>
                        <Calendar value={selectedPaciente?.fechaNacimiento ?? null} onChange={(e) => setSelectedPaciente({ ...selectedPaciente!, fechaNacimiento: (e.value as Date) ?? null })} dateFormat="yy-mm-dd" />
                    </div>
                    <div className="field">
                        <label>Email</label>
                        <InputText value={selectedPaciente?.email} onChange={(e) => setSelectedPaciente({ ...selectedPaciente!, email: e.target.value })} />
                    </div>
                </div>
                <Button label="Guardar" icon="pi pi-check" onClick={savePaciente} />
            </Dialog>
        </div>
    );
};

export default PacientesPage;