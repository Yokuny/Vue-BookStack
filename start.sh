#!/bin/bash

echo "🐳 BookStack Docker Setup"

show_help() {
    echo ""
    echo "Uso: ./start.sh [OPÇÃO]"
    echo ""
    echo "Opções:"
    echo "  prod, production     Executar em modo produção"
    echo "  dev, development     Executar em modo desenvolvimento (com hot reload)"
    echo "  stop                 Parar todos os containers"
    echo "  logs                 Mostrar logs de todos os serviços"
    echo "  clean               Limpar containers e volumes"
    echo "  help                Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  ./start.sh prod      # Executar em produção"
    echo "  ./start.sh dev       # Executar em desenvolvimento"
    echo "  ./start.sh stop      # Parar containers"
}

if ! command -v docker &> /dev/null; then
    echo "Serviços do docker estão ativos"
    exit 1
fi

if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo "Docker Compose não está instalado"
    exit 1
fi

case "$1" in
    "prod"|"production")
        echo ""
        echo "🚀 Iniciando em modo PRODUÇÃO..."
        echo "   Frontend: http://localhost:5173"
        echo "   Backend API: http://localhost:8080"
        echo "   MongoDB: mongodb://localhost:27017"
        echo ""
        $DOCKER_COMPOSE up --build
        ;;
    
    "dev"|"development")
        echo ""
        echo "🛠️  Iniciando em modo DESENVOLVIMENTO..."
        echo "   Frontend: http://localhost:5173"
        echo "   Backend API: http://localhost:8080"
        echo "   MongoDB: mongodb://localhost:27017"
        echo ""
        $DOCKER_COMPOSE -f docker-compose.dev.yml up --build
        ;;
    
    "stop")
        echo ""
        $DOCKER_COMPOSE down
        $DOCKER_COMPOSE -f docker-compose.dev.yml down
        echo "✅ Containers parados"
        ;;
    
    "logs")
        echo "📋 Mostrando logs..."
        $DOCKER_COMPOSE logs -f
        ;;
    
    "clean")
        echo ""
        $DOCKER_COMPOSE down -v
        $DOCKER_COMPOSE -f docker-compose.dev.yml down -v
        docker system prune -f
        echo "✅ Limpeza concluída"
        ;;
        
    
    "help"|"--help"|"-h")
        show_help
        ;;
    
    "")
        echo ""
        echo " Opção não fornecida"
        show_help
        exit 1
        ;;
    
    *)
        echo ""
        echo " Opção inválida: $1"
        show_help
        exit 1
        ;;
esac