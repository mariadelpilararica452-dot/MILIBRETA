package com.ejemplo.miagenda

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.Checkbox
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

// Niveles de prioridad disponibles para cada actividad
enum class Prioridad(val etiqueta: String, val color: Color) {
    BAJA("Baja", Color(0xFF047857)),
    MEDIA("Media", Color(0xFFB45309)),
    ALTA("Alta", Color(0xFFB91C1C))
}

// Modelo simple para representar cada actividad en memoria
data class Actividad(
    val id: Long,
    val titulo: String,
    val fecha: String,
    val prioridad: Prioridad = Prioridad.MEDIA,
    val completada: Boolean = false
)

fun obtenerFechaHoy(): String {
    val formato = java.text.SimpleDateFormat("dd/MM/yyyy", java.util.Locale.getDefault())
    return formato.format(java.util.Date())
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                MiAgendaScreen()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MiAgendaScreen() {
    val fechaHoy = remember { obtenerFechaHoy() }

    // Texto, fecha y prioridad que el alumno selecciona en el formulario
    var textoActividad by remember { mutableStateOf("") }
    var fechaActividad by remember { mutableStateOf(fechaHoy) }
    var prioridadSeleccionada by remember { mutableStateOf(Prioridad.MEDIA) }
    var mostrarError by remember { mutableStateOf(false) }
    var textoBusqueda by remember { mutableStateOf("") }
    var filtroPrioridad by remember { mutableStateOf<Prioridad?>(null) }

    // Estado para editar una actividad existente
    var actividadEnEdicion by remember { mutableStateOf<Actividad?>(null) }
    var tituloEdicion by remember { mutableStateOf("") }
    var fechaEdicion by remember { mutableStateOf("") }
    var errorEdicion by remember { mutableStateOf(false) }

    // Lista de actividades guardada solo en memoria mientras la app está abierta
    val actividades = remember {
        mutableStateListOf(
            Actividad(1L, "Repasar funciones @Composable", fechaHoy, Prioridad.ALTA),
            Actividad(2L, "Practicar LazyColumn con una lista", fechaHoy, Prioridad.MEDIA),
            Actividad(3L, "Probar el botón de eliminar actividad", fechaHoy, Prioridad.BAJA, completada = true)
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(text = "Mi Agenda") }
            )
        }
    ) { paddingInterno ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingInterno)
                .padding(16.dp)
        ) {
            // 1. Campo para escribir una nueva actividad
            OutlinedTextField(
                value = textoActividad,
                onValueChange = {
                    textoActividad = it
                    if (mostrarError) mostrarError = false
                },
                label = { Text("Escribe una actividad") },
                isError = mostrarError,
                supportingText = {
                    if (mostrarError) {
                        Text("Por favor, escribe una actividad.")
                    }
                },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(8.dp))

            // 2. Campo opcional para la fecha (si queda vacío, usa la fecha de hoy)
            OutlinedTextField(
                value = fechaActividad,
                onValueChange = { fechaActividad = it },
                label = { Text("Fecha (opcional, por defecto hoy)") },
                placeholder = { Text(fechaHoy) },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(10.dp))

            // 3. Selector de prioridad (Baja, Media, Alta)
            Text(
                text = "Prioridad",
                style = MaterialTheme.typography.labelLarge
            )
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Prioridad.entries.forEach { nivel ->
                    FilterChip(
                        selected = prioridadSeleccionada == nivel,
                        onClick = { prioridadSeleccionada = nivel },
                        label = { Text(nivel.etiqueta) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // 4. Botón para agregar la actividad a la lista
            Button(
                onClick = {
                    val tituloLimpio = textoActividad.trim()
                    if (tituloLimpio.isEmpty()) {
                        mostrarError = true
                    } else {
                        val fechaFinal = fechaActividad.trim().ifEmpty { obtenerFechaHoy() }
                        actividades.add(
                            0,
                            Actividad(
                                id = System.currentTimeMillis(),
                                titulo = tituloLimpio,
                                fecha = fechaFinal,
                                prioridad = prioridadSeleccionada
                            )
                        )
                        textoActividad = ""
                        fechaActividad = obtenerFechaHoy()
                        prioridadSeleccionada = Prioridad.MEDIA
                        mostrarError = false
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
            ) {
                Text("Agregar actividad")
            }

            Spacer(modifier = Modifier.height(16.dp))

            // 5. Tarjeta de resumen con barra de progreso
            val completadas = actividades.count { it.completada }
            val progreso = if (actividades.isEmpty()) 0f else completadas.toFloat() / actividades.size
            val porcentaje = (progreso * 100).toInt()

            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column {
                            Text(
                                text = "Progreso de tareas",
                                style = MaterialTheme.typography.titleSmall
                            )
                            Text(
                                text = "$completadas de ${actividades.size} completadas",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        Text(
                            text = "$porcentaje%",
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    LinearProgressIndicator(
                        progress = { progreso },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(8.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // 6. Barra de búsqueda en tiempo real
            OutlinedTextField(
                value = textoBusqueda,
                onValueChange = { textoBusqueda = it },
                placeholder = { Text("Buscar actividad por nombre...") },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Buscar"
                    )
                },
                trailingIcon = {
                    if (textoBusqueda.isNotEmpty()) {
                        IconButton(onClick = { textoBusqueda = "" }) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Limpiar búsqueda"
                            )
                        }
                    }
                },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(8.dp))

            // 7. Selector de filtros por prioridad (Todas, Alta, Media, Baja)
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                FilterChip(
                    selected = filtroPrioridad == null,
                    onClick = { filtroPrioridad = null },
                    label = { Text("Todas") }
                )
                listOf(Prioridad.ALTA, Prioridad.MEDIA, Prioridad.BAJA).forEach { nivel ->
                    FilterChip(
                        selected = filtroPrioridad == nivel,
                        onClick = { filtroPrioridad = nivel },
                        label = { Text(nivel.etiqueta) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // 8. Lista de actividades filtradas
            val actividadesFiltradas = actividades.filter { actividad ->
                val coincideBusqueda = textoBusqueda.isBlank() ||
                    actividad.titulo.contains(textoBusqueda.trim(), ignoreCase = true)
                val coincidePrioridad = filtroPrioridad == null || actividad.prioridad == filtroPrioridad
                coincideBusqueda && coincidePrioridad
            }

            if (actividades.isEmpty()) {
                Text(
                    text = "No hay actividades todavía. Escribe una arriba para empezar.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            } else if (actividadesFiltradas.isEmpty()) {
                Text(
                    text = "No se encontraron actividades con los filtros actuales.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            } else {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(items = actividadesFiltradas, key = { it.id }) { actividad ->
                        ItemActividad(
                            actividad = actividad,
                            onCambiarEstado = { marcada ->
                                val indice = actividades.indexOfFirst { it.id == actividad.id }
                                if (indice != -1) {
                                    actividades[indice] = actividad.copy(completada = marcada)
                                }
                            },
                            onEditar = {
                                actividadEnEdicion = actividad
                                tituloEdicion = actividad.titulo
                                fechaEdicion = actividad.fecha
                                errorEdicion = false
                            },
                            onEliminar = {
                                actividades.removeAll { it.id == actividad.id }
                            }
                        )
                    }
                }
            }
        }
    }

    // Diálogo sencillo para editar nombre y fecha de una actividad
    val actual = actividadEnEdicion
    if (actual != null) {
        AlertDialog(
            onDismissRequest = { actividadEnEdicion = null },
            title = { Text("Editar actividad") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = tituloEdicion,
                        onValueChange = {
                            tituloEdicion = it
                            if (errorEdicion) errorEdicion = false
                        },
                        label = { Text("Nombre de la actividad") },
                        isError = errorEdicion,
                        supportingText = {
                            if (errorEdicion) {
                                Text("Por favor, escribe una actividad.")
                            }
                        },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = fechaEdicion,
                        onValueChange = { fechaEdicion = it },
                        label = { Text("Fecha") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val tituloLimpio = tituloEdicion.trim()
                        if (tituloLimpio.isEmpty()) {
                            errorEdicion = true
                        } else {
                            val fechaFinal = fechaEdicion.trim().ifEmpty { obtenerFechaHoy() }
                            val indice = actividades.indexOfFirst { it.id == actual.id }
                            if (indice != -1) {
                                actividades[indice] = actual.copy(
                                    titulo = tituloLimpio,
                                    fecha = fechaFinal
                                )
                            }
                            actividadEnEdicion = null
                        }
                    }
                ) {
                    Text("Guardar")
                }
            },
            dismissButton = {
                TextButton(onClick = { actividadEnEdicion = null }) {
                    Text("Cancelar")
                }
            }
        )
    }
}

@Composable
fun ItemActividad(
    actividad: Actividad,
    onCambiarEstado: (Boolean) -> Unit,
    onEditar: () -> Unit,
    onEliminar: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 6.dp)
        ) {
            // Control para marcar como completada
            Checkbox(
                checked = actividad.completada,
                onCheckedChange = onCambiarEstado
            )

            // Nombre, fecha y prioridad de la actividad
            Column(
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 8.dp)
            ) {
                Text(
                    text = actividad.titulo,
                    style = MaterialTheme.typography.bodyLarge,
                    textDecoration = if (actividad.completada) {
                        TextDecoration.LineThrough
                    } else {
                        TextDecoration.None
                    }
                )
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = actividad.fecha,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "Prioridad ${actividad.prioridad.etiqueta}",
                        style = MaterialTheme.typography.labelSmall,
                        color = actividad.prioridad.color
                    )
                }
            }

            // Botón para editar la actividad
            IconButton(onClick = onEditar) {
                Icon(
                    imageVector = Icons.Default.Edit,
                    contentDescription = "Editar actividad"
                )
            }

            // Botón para eliminar la actividad
            IconButton(onClick = onEliminar) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = "Eliminar actividad"
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun MiAgendaPreview() {
    MaterialTheme {
        MiAgendaScreen()
    }
}
