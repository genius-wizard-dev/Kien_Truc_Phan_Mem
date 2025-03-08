package Bai_02;

interface OrderState {
  void process(OrderContext context);
}

class NewOrderState implements OrderState {
  @Override
  public void process(OrderContext context) {
    System.out.println("Kiểm tra thông tin đơn hàng");
    context.setState(new ProcessingState());
  }
}

class ProcessingState implements OrderState {
  @Override
  public void process(OrderContext context) {
    System.out.println("Đóng gói và vận chuyển");
    context.setState(new ShippedState());
  }
}

class ShippedState implements OrderState {
  @Override
  public void process(OrderContext context) {
    System.out.println("Đơn hàng đã được giao thành công");
    context.setState(new DeliveredState());
  }
}

class DeliveredState implements OrderState {
  @Override
  public void process(OrderContext context) {
    System.out.println("Xác nhận đơn hàng đã hoàn thành");
  }
}

class OrderContext {
  private OrderState currentState;

  public OrderContext() {
    this.currentState = new NewOrderState();
  }

  public void processOrder() {
    currentState.process(this);
  }

  public void setState(OrderState state) {
    this.currentState = state;
  }

  public static void main(String[] args) {
    OrderContext order = new OrderContext();

    System.out.println("Bắt đầu xử lý đơn hàng:");
    order.processOrder();
    order.processOrder();
    order.processOrder();
  }
}
