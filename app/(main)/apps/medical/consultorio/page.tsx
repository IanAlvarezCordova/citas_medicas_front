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

interface Consultorio {
	id?: number;
	numero: string;
	piso: number | string;
}

const ConsultoriosPage = () => {
	const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
	const [selectedConsultorio, setSelectedConsultorio] = useState<Consultorio | null>(null);
	const [dialogVisible, setDialogVisible] = useState(false);
	const [isNew, setIsNew] = useState(true);
	const toast = useRef<Toast>(null);

	useEffect(() => {
		fetchConsultorios();
	}, []);

	const fetchConsultorios = async () => {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/consultorios`);
		const data = await response.json();
		setConsultorios(data);
	};

	const saveConsultorio = async () => {
		if (!selectedConsultorio) return;
		const url = isNew ? `${process.env.NEXT_PUBLIC_API_URL}/api/consultorios` : `${process.env.NEXT_PUBLIC_API_URL}/api/consultorios/${selectedConsultorio.id}`;
		const method = isNew ? 'POST' : 'PUT';
		const body = {
			numero: selectedConsultorio.numero,
			piso: typeof selectedConsultorio.piso === 'string' ? parseInt(selectedConsultorio.piso) : selectedConsultorio.piso
		};
		const response = await fetch(url, {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
		if (response.ok) {
			toast.current?.show({ severity: 'success', summary: 'Éxito', detail: isNew ? 'Consultorio creado' : 'Consultorio actualizado' });
			fetchConsultorios();
			setDialogVisible(false);
		} else {
			toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar' });
		}
	};

	const deleteConsultorio = (id: number) => {
		confirmDialog({
			message: '¿Eliminar este consultorio?',
			header: 'Confirmación',
			icon: 'pi pi-exclamation-triangle',
			accept: async () => {
				await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/consultorios/${id}`, { method: 'DELETE' });
				toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Consultorio eliminado' });
				fetchConsultorios();
			}
		});
	};

	const openDialog = (consultorio?: Consultorio) => {
		setSelectedConsultorio(consultorio ? { ...consultorio } : { numero: '', piso: '' });
		setIsNew(!consultorio);
		setDialogVisible(true);
	};

	const actionsBody = (rowData: Consultorio) => (
		<div>
			<Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => openDialog(rowData)} />
			<Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteConsultorio(rowData.id!)} />
		</div>
	);

	return (
		<div className="card">
			<Toast ref={toast} />
			<ConfirmDialog />
			<h5>Consultorios</h5>
			<Button label="Nuevo" icon="pi pi-plus" className="mb-3" onClick={() => openDialog()} />
			<DataTable value={consultorios} paginator rows={10} responsiveLayout="scroll">
				<Column field="numero" header="Número" sortable />
				<Column field="piso" header="Piso" sortable />
				<Column header="Acciones" body={actionsBody} />
			</DataTable>

			<Dialog visible={dialogVisible} header={isNew ? 'Nuevo Consultorio' : 'Editar Consultorio'} onHide={() => setDialogVisible(false)}>
				<div className="p-fluid">
					<div className="field">
						<label>Número</label>
						<InputText value={selectedConsultorio?.numero} onChange={(e) => setSelectedConsultorio({ ...selectedConsultorio!, numero: e.target.value })} />
					</div>
					<div className="field">
						<label>Piso</label>
						<InputText value={selectedConsultorio?.piso?.toString()} onChange={(e) => setSelectedConsultorio({ ...selectedConsultorio!, piso: e.target.value })} />
					</div>
				</div>
				<Button label="Guardar" icon="pi pi-check" onClick={saveConsultorio} />
			</Dialog>
		</div>
	);
};

export default ConsultoriosPage; 