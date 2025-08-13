'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmDialog } from 'primereact/confirmdialog';

interface Medico {
	id?: number;
	nombre: string;
	apellido: string;
	especialidad: string;
}

const MedicosPage = () => {
	const [medicos, setMedicos] = useState<Medico[]>([]);
	const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null);
	const [dialogVisible, setDialogVisible] = useState(false);
	const [isNew, setIsNew] = useState(true);
	const toast = useRef<Toast>(null);

	useEffect(() => {
		fetchMedicos();
	}, []);

	const fetchMedicos = async () => {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medicos`);
		const data = await response.json();
		setMedicos(data);
	};

	const saveMedico = async () => {
		if (!selectedMedico) return;
		const url = isNew ? `${process.env.NEXT_PUBLIC_API_URL}/api/medicos` : `${process.env.NEXT_PUBLIC_API_URL}/api/medicos/${selectedMedico.id}`;
		const method = isNew ? 'POST' : 'PUT';
		const response = await fetch(url, {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ nombre: selectedMedico.nombre, apellido: selectedMedico.apellido, especialidad: selectedMedico.especialidad })
		});
		if (response.ok) {
			toast.current?.show({ severity: 'success', summary: 'Éxito', detail: isNew ? 'Médico creado' : 'Médico actualizado' });
			fetchMedicos();
			setDialogVisible(false);
		} else {
			toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar' });
		}
	};

	const deleteMedico = (id: number) => {
		confirmDialog({
			message: '¿Eliminar este médico?',
			header: 'Confirmación',
			icon: 'pi pi-exclamation-triangle',
			accept: async () => {
				await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medicos/${id}`, { method: 'DELETE' });
				toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Médico eliminado' });
				fetchMedicos();
			}
		});
	};

	const openDialog = (medico?: Medico) => {
		setSelectedMedico(medico ? { ...medico } : { nombre: '', apellido: '', especialidad: '' } as Medico);
		setIsNew(!medico);
		setDialogVisible(true);
	};

	const actionsBody = (rowData: Medico) => (
		<div>
			<Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => openDialog(rowData)} />
			<Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteMedico(rowData.id!)} />
		</div>
	);

	return (
		<div className="card">
			<Toast ref={toast} />
			<ConfirmDialog />
			<h5>Médicos</h5>
			<Button label="Nuevo" icon="pi pi-plus" className="mb-3" onClick={() => openDialog()} />
			<DataTable value={medicos} paginator rows={10} responsiveLayout="scroll">
				<Column field="nombre" header="Nombre" sortable />
				<Column field="apellido" header="Apellido" sortable />
				<Column field="especialidad" header="Especialidad" sortable />
				<Column header="Acciones" body={actionsBody} />
			</DataTable>

			<Dialog visible={dialogVisible} header={isNew ? 'Nuevo Médico' : 'Editar Médico'} onHide={() => setDialogVisible(false)}>
				<div className="p-fluid">
					<div className="field">
						<label>Nombre</label>
						<InputText value={selectedMedico?.nombre} onChange={(e) => setSelectedMedico({ ...selectedMedico!, nombre: e.target.value })} />
					</div>
					<div className="field">
						<label>Apellido</label>
						<InputText value={selectedMedico?.apellido} onChange={(e) => setSelectedMedico({ ...selectedMedico!, apellido: e.target.value })} />
					</div>
					<div className="field">
						<label>Especialidad</label>
						<InputText value={selectedMedico?.especialidad} onChange={(e) => setSelectedMedico({ ...selectedMedico!, especialidad: e.target.value })} />
					</div>
				</div>
				<Button label="Guardar" icon="pi pi-check" onClick={saveMedico} />
			</Dialog>
		</div>
	);
};

export default MedicosPage; 