'use client';

import React, { useEffect, useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

interface Paciente {
	id: number;
	nombre: string;
	apellido: string;
	fechaNacimiento?: string;
	email?: string;
}

interface Medico {
	id: number;
	nombre: string;
	apellido: string;
	especialidad?: string;
}

interface Consultorio {
	id: number;
	numero: string | number;
	piso?: string | number;
}

interface Cita {
	id: number;
	fecha?: string;
	hora?: string;
	paciente?: Paciente | null;
	medico?: Medico | null;
	consultorio?: Consultorio | null;
}

async function fetchJSON<T>(path: string): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
	if (!res.ok) throw new Error(`Error al cargar ${path}: ${res.status}`);
	return res.json();
}

export default function CitasPage() {
	const [pacientes, setPacientes] = useState<Paciente[]>([]);
	const [medicos, setMedicos] = useState<Medico[]>([]);
	const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
	const [citas, setCitas] = useState<Cita[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const cargar = async () => {
		try {
			setError(null);
			setLoading(true);
			const [p, m, c, ci] = await Promise.all([
				fetchJSON<Paciente[]>('/api/pacientes'),
				fetchJSON<Medico[]>('/api/medicos'),
				fetchJSON<Consultorio[]>('/api/consultorios'),
				fetchJSON<Cita[]>('/api/citas')
			]);
			setPacientes(p);
			setMedicos(m);
			setConsultorios(c);
			setCitas(ci);
		} catch (e: any) {
			setError(e?.message ?? 'Error desconocido');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		cargar();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const header = (
		<div className="flex align-items-center justify-content-between">
			<span className="text-lg font-medium">Gestión básica</span>
			<button className="p-button p-component p-button-sm" onClick={cargar} disabled={loading}>
				<i className={`pi ${loading ? 'pi-spin pi-spinner' : 'pi-refresh'} mr-2`} />
				<span>Actualizar</span>
			</button>
		</div>
	);

	return (
		<Card title="Citas Médicas" subTitle="Vista de solo lectura" header={header}>
			{error && <div className="p-2 mb-3 border-round bg-red-100 text-red-800">{error}</div>}
			<TabView>
				<TabPanel header="Pacientes">
					<DataTable value={pacientes} loading={loading} paginator rows={10} size="small" emptyMessage="Sin registros">
						<Column field="id" header="ID" sortable style={{ width: '6rem' }} />
						<Column field="nombre" header="Nombre" sortable />
						<Column field="apellido" header="Apellido" sortable />
						<Column field="email" header="Email" />
						<Column field="fechaNacimiento" header="Nacimiento" />
					</DataTable>
				</TabPanel>
				<TabPanel header="Médicos">
					<DataTable value={medicos} loading={loading} paginator rows={10} size="small" emptyMessage="Sin registros">
						<Column field="id" header="ID" sortable style={{ width: '6rem' }} />
						<Column field="nombre" header="Nombre" sortable />
						<Column field="apellido" header="Apellido" sortable />
						<Column field="especialidad" header="Especialidad" />
					</DataTable>
				</TabPanel>
				<TabPanel header="Consultorios">
					<DataTable value={consultorios} loading={loading} paginator rows={10} size="small" emptyMessage="Sin registros">
						<Column field="id" header="ID" sortable style={{ width: '6rem' }} />
						<Column field="numero" header="Número" sortable />
						<Column field="piso" header="Piso" />
					</DataTable>
				</TabPanel>
				<TabPanel header="Citas">
					<DataTable value={citas} loading={loading} paginator rows={10} size="small" emptyMessage="Sin registros">
						<Column field="id" header="ID" sortable style={{ width: '6rem' }} />
						<Column field="fecha" header="Fecha" />
						<Column field="hora" header="Hora" />
						<Column header="Paciente" body={(row: Cita) => row.paciente ? `${row.paciente.nombre} ${row.paciente.apellido}` : ''} />
						<Column header="Médico" body={(row: Cita) => row.medico ? `${row.medico.nombre} ${row.medico.apellido}` : ''} />
						<Column header="Consultorio" body={(row: Cita) => row.consultorio ? `#${row.consultorio.numero}` : ''} />
					</DataTable>
				</TabPanel>
			</TabView>
		</Card>
	);
} 