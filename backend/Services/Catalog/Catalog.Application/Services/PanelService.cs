using Catalog.Application.Abstractions.Repository;
using Catalog.Application.Abstractions.Service;
using Catalog.Core.Entities;

namespace Catalog.Application.Services
{
    /// <summary>
    /// Implementazione del service: contiene la logica di business per i Panel (dettagli cigari).
    /// Dipende solo dalle interface, mai dalle implementazioni concrete.
    /// </summary>
    public class PanelService : IPanelService
    {
        private readonly IPanelRepository _repository;
        private readonly ITobacconistRepository tobacconistRepository;

        public PanelService(IPanelRepository repository, ITobacconistRepository tobacconistRepository)
        {
            _repository = repository;
            this.tobacconistRepository = tobacconistRepository;
        }

        public async Task<ICollection<Panel>> GetAllPanelsAsync(CancellationToken cancellationToken = default)
        {
            var result = await _repository.GetAllAsync(cancellationToken);
            return result.ToList();
        }

        public async Task<Panel?> GetPanelByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _repository.GetByIdAsync(id, cancellationToken);
        }

        public async Task<ICollection<Panel>> GetPanelsByBrandAsync(Guid brandId, CancellationToken cancellationToken = default)
        {
            var result = await _repository.GetByBrandAsync(brandId, cancellationToken);
            return result.ToList();
        }

        public async Task<Panel> AddPanelAsync(Panel panel, CancellationToken cancellationToken = default)
        {
            panel.id = Guid.NewGuid();
            await _repository.AddAsync(panel, cancellationToken);

            if (panel.TobacconistId.HasValue)
            {
                var tobacconist = await tobacconistRepository.GetByIdAsync(panel.TobacconistId.Value, cancellationToken);
                if (tobacconist != null)
                {
                    tobacconist.PanelId = panel.id;
                    await tobacconistRepository.UpdateAsync(tobacconist, cancellationToken);
                }
            }

            return panel;
        }

        public async Task UpdatePanelAsync(Panel panel, CancellationToken cancellationToken = default)
        {
            await _repository.UpdateAsync(panel, cancellationToken);
        }

        public async Task DeletePanelAsync(Guid id, CancellationToken cancellationToken = default)
        {
            await _repository.DeleteAsync(id, cancellationToken);
        }
    }
}
