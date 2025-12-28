using Microsoft.AspNetCore.Mvc;
using OrderService.Models;
using OrderService.Services;

namespace OrderService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly OrderStatusService _statusService;

        public OrdersController(OrderStatusService statusService)
        {
            _statusService = statusService;
        }

        [HttpPatch("status")]
        public async Task<IActionResult> UpdateStatus([FromBody] OrderStatusDto request)
        {
            if (request == null) return BadRequest(new { message = "body is empty, bestie!" });

            var result = await _statusService.UpdateStatusAsync(request);

            if (result.Contains("success")) return Ok(new { message = result });

            return BadRequest(new { message = result });
        }
    }
}