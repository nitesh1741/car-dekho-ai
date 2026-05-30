from backend.app.main import APP_NAME, app, health_check


def test_health_check_payload() -> None:
    assert health_check() == {
        "status": "ok",
        "service": APP_NAME,
    }


def test_health_route_registered() -> None:
    matching_routes = [
        route
        for route in app.routes
        if getattr(route, "path", None) == "/health"
        and "GET" in getattr(route, "methods", set())
    ]

    assert len(matching_routes) == 1
