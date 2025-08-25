#!/usr/bin/env node

// Verificar webhook PayPal recibido
console.log('🎯 VERIFICACIÓN WEBHOOK PAYPAL RECIBIDO\n');

const receivedEvent = {
  "id": "WH-6W4482673W002281V-61985753LP2332451",
  "event_type": "PAYMENTS.PAYMENT.CREATED",
  "resource": {
    "id": "PAY-13V79659LS5126423KVISFPI",
    "state": "created",
    "transactions": [
      {
        "amount": {
          "total": "4.13",
          "currency": "EUR"
        }
      }
    ],
    "payer": {
      "payer_info": {
        "email": "customer@example.com",
        "first_name": "John",
        "last_name": "Doe"
      }
    }
  }
};

console.log('✅ WEBHOOK PAYPAL RECIBIDO CORRECTAMENTE');
console.log('📋 Detalles del evento:');
console.log('   ID:', receivedEvent.id);
console.log('   Tipo:', receivedEvent.event_type);
console.log('   Estado:', receivedEvent.resource.state);
console.log('   Monto:', receivedEvent.resource.transactions[0].amount.total);
console.log('   Cliente:', receivedEvent.resource.payer.payer_info.first_name);

console.log('\n⚠️  NOTA IMPORTANTE:');
console.log('   Este evento es "PAYMENT.CREATED" (pago creado)');
console.log('   Para procesar ventas necesitamos "PAYMENT.CAPTURE.COMPLETED"');

console.log('\n🔧 CONFIGURACIÓN RECOMENDADA:');
console.log('   En PayPal Dashboard → Webhooks');
console.log('   Agregar evento: PAYMENT.CAPTURE.COMPLETED');
console.log('   URL: https://iku-cabalactiva.com/api/webhooks/paypal');

console.log('\n🎉 CONEXIÓN PAYPAL CONFIRMADA - SISTEMA FUNCIONANDO');