package com.uniprest.backend.domain.exception;

public class ReglaNegocioException extends RuntimeException {
    private final int status;
    public ReglaNegocioException(String mensaje) { this(mensaje, 400); }
    public ReglaNegocioException(String mensaje, int status) { super(mensaje); this.status = status; }
    public int getStatus() { return status; }
}
