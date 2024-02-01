package de.dmalo.safegpt.conversation.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import de.dmalo.safegpt.conversation.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProviderDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProviderDTO.class);
        ProviderDTO providerDTO1 = new ProviderDTO();
        providerDTO1.setId(1L);
        ProviderDTO providerDTO2 = new ProviderDTO();
        assertThat(providerDTO1).isNotEqualTo(providerDTO2);
        providerDTO2.setId(providerDTO1.getId());
        assertThat(providerDTO1).isEqualTo(providerDTO2);
        providerDTO2.setId(2L);
        assertThat(providerDTO1).isNotEqualTo(providerDTO2);
        providerDTO1.setId(null);
        assertThat(providerDTO1).isNotEqualTo(providerDTO2);
    }
}
